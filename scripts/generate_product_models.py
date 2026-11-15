import json
import math
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "models"

PALETTE = {
    "green": ([0.08, 0.36, 0.20, 1], 0.1),
    "blue": ([0.06, 0.24, 0.56, 1], 0.1),
    "red": ([0.72, 0.12, 0.12, 1], 0.1),
    "purple": ([0.31, 0.16, 0.48, 1], 0.1),
    "black": ([0.035, 0.045, 0.06, 1], 0.08),
    "dark": ([0.10, 0.12, 0.15, 1], 0.08),
    "white": ([0.88, 0.90, 0.91, 1], 0.05),
    "cream": ([0.90, 0.86, 0.72, 1], 0.05),
    "silver": ([0.62, 0.67, 0.70, 1], 0.72),
    "gold": ([0.78, 0.55, 0.16, 1], 0.68),
    "copper": ([0.66, 0.32, 0.16, 1], 0.6),
    "chip": ([0.045, 0.055, 0.07, 1], 0.08),
    "screen": ([0.015, 0.025, 0.04, 1], 0.05),
    "lcd": ([0.16, 0.40, 0.46, 1], 0.04),
    "display": ([0.04, 0.48, 0.52, 1], 0.04),
    "yellow": ([0.92, 0.62, 0.06, 1], 0.05),
    "orange": ([0.86, 0.27, 0.06, 1], 0.05),
    "red_led": ([0.86, 0.035, 0.02, 1], 0.12),
    "blue_led": ([0.04, 0.30, 0.94, 1], 0.12),
    "green_led": ([0.04, 0.72, 0.20, 1], 0.12),
    "white_led": ([0.92, 0.95, 1.0, 1], 0.1),
}


class Model:
    def __init__(self):
        self.triangles = {name: [] for name in PALETTE}

    def triangle(self, material, a, b, c):
        ab = (b[0] - a[0], b[1] - a[1], b[2] - a[2])
        ac = (c[0] - a[0], c[1] - a[1], c[2] - a[2])
        normal = (
            ab[1] * ac[2] - ab[2] * ac[1],
            ab[2] * ac[0] - ab[0] * ac[2],
            ab[0] * ac[1] - ab[1] * ac[0],
        )
        length = math.sqrt(sum(value * value for value in normal)) or 1
        normal = tuple(value / length for value in normal)
        self.triangles[material].append((a, normal))
        self.triangles[material].append((b, normal))
        self.triangles[material].append((c, normal))

    def quad(self, material, a, b, c, d):
        self.triangle(material, a, b, c)
        self.triangle(material, a, c, d)

    def box(self, center, size, material):
        x, y, z = center
        sx, sy, sz = (value / 2 for value in size)
        xm, xp = x - sx, x + sx
        ym, yp = y - sy, y + sy
        zm, zp = z - sz, z + sz
        self.quad(material, (xp, ym, zm), (xp, yp, zm), (xp, yp, zp), (xp, ym, zp))
        self.quad(material, (xm, ym, zp), (xm, yp, zp), (xm, yp, zm), (xm, ym, zm))
        self.quad(material, (xm, yp, zm), (xm, yp, zp), (xp, yp, zp), (xp, yp, zm))
        self.quad(material, (xm, ym, zp), (xm, ym, zm), (xp, ym, zm), (xp, ym, zp))
        self.quad(material, (xm, ym, zp), (xp, ym, zp), (xp, yp, zp), (xm, yp, zp))
        self.quad(material, (xp, ym, zm), (xm, ym, zm), (xm, yp, zm), (xp, yp, zm))

    def cylinder(self, start, end, radius, material, segments=16, radius_end=None):
        direction = tuple(end[i] - start[i] for i in range(3))
        length = math.sqrt(sum(value * value for value in direction))
        if length == 0:
            return
        axis = tuple(value / length for value in direction)
        reference = (1, 0, 0) if abs(axis[0]) < 0.85 else (0, 0, 1)
        u = (
            reference[1] * axis[2] - reference[2] * axis[1],
            reference[2] * axis[0] - reference[0] * axis[2],
            reference[0] * axis[1] - reference[1] * axis[0],
        )
        u_len = math.sqrt(sum(value * value for value in u))
        u = tuple(value / u_len for value in u)
        v = (
            axis[1] * u[2] - axis[2] * u[1],
            axis[2] * u[0] - axis[0] * u[2],
            axis[0] * u[1] - axis[1] * u[0],
        )
        other_radius = radius if radius_end is None else radius_end
        rings = []
        for point, ring_radius in ((start, radius), (end, other_radius)):
            ring = []
            for i in range(segments):
                angle = 2 * math.pi * i / segments
                ring.append(tuple(
                    point[j] + ring_radius * (math.cos(angle) * u[j] + math.sin(angle) * v[j])
                    for j in range(3)
                ))
            rings.append(ring)
        bottom, top = rings
        for i in range(segments):
            j = (i + 1) % segments
            self.triangle(material, bottom[i], top[j], top[i])
            self.triangle(material, bottom[i], bottom[j], top[j])
            self.triangle(material, start, bottom[j], bottom[i])
            self.triangle(material, end, top[i], top[j])

    def sphere(self, center, radii, material, rings=10, segments=16):
        cx, cy, cz = center
        rx, ry, rz = radii
        points = []
        for row in range(rings + 1):
            phi = math.pi * row / rings
            line = []
            for col in range(segments):
                theta = 2 * math.pi * col / segments
                line.append((
                    cx + rx * math.sin(phi) * math.cos(theta),
                    cy + ry * math.cos(phi),
                    cz + rz * math.sin(phi) * math.sin(theta),
                ))
            points.append(line)
        for row in range(rings):
            for col in range(segments):
                nxt = (col + 1) % segments
                self.triangle(material, points[row][col], points[row + 1][col], points[row + 1][nxt])
                self.triangle(material, points[row][col], points[row + 1][nxt], points[row][nxt])

    def board(self, width, depth, material="green"):
        self.box((0, 0.025, 0), (width, 0.05, depth), material)
        for x in (-width * 0.44, width * 0.44):
            for z in (-depth * 0.4, depth * 0.4):
                self.cylinder((x, 0.05, z), (x, 0.058, z), 0.025, "gold", 10)

    def chip(self, x, z, width, depth, height=0.09, material="chip"):
        self.box((x, 0.05 + height / 2, z), (width, height, depth), material)
        for side in (-1, 1):
            for i in range(3):
                px = x + (i - 1) * width * 0.28
                self.box((px, 0.055, z + side * (depth / 2 + 0.008)), (0.018, 0.018, 0.035), "silver")

    def pin_rows(self, count, width, depth, rows=2):
        for row in range(rows):
            z = (row - (rows - 1) / 2) * depth * 0.76
            strip_width = min(width * 0.86, count * 0.055)
            self.box((0, 0.085, z), (strip_width, 0.055, 0.06), "black")
            for i in range(count):
                x = (i - (count - 1) / 2) * (strip_width / max(count - 1, 1))
                self.cylinder((x, -0.13, z), (x, 0.02, z), 0.009, "gold", 7)

    def usb(self, x, z, width=0.20):
        self.box((x, 0.11, z), (width, 0.13, 0.16), "silver")
        self.box((x, 0.115, z + 0.083), (width * 0.72, 0.055, 0.008), "dark")

    def led(self, x, z, color="red_led"):
        self.cylinder((x, 0.05, z), (x, 0.095, z), 0.025, "silver", 10)
        self.sphere((x, 0.11, z), (0.025, 0.025, 0.025), color, 6, 10)

    def add_gltf(self, path):
        materials = []
        material_ids = {}
        for name, (color, metallic) in PALETTE.items():
            material_ids[name] = len(materials)
            materials.append({
                "name": name,
                "pbrMetallicRoughness": {
                    "baseColorFactor": color,
                    "metallicFactor": metallic,
                    "roughnessFactor": 0.48 if metallic else 0.72,
                },
            })

        binary = bytearray()
        buffer_views = []
        accessors = []
        primitives = []

        def append_view(data, target):
            while len(binary) % 4:
                binary.append(0)
            offset = len(binary)
            binary.extend(data)
            view_id = len(buffer_views)
            buffer_views.append({"buffer": 0, "byteOffset": offset, "byteLength": len(data), "target": target})
            return view_id

        for name, vertices in self.triangles.items():
            if not vertices:
                continue
            positions = [position for position, _ in vertices]
            normals = [normal for _, normal in vertices]
            position_bytes = struct.pack("<" + "f" * (len(positions) * 3), *(v for p in positions for v in p))
            normal_bytes = struct.pack("<" + "f" * (len(normals) * 3), *(v for n in normals for v in n))
            index_values = list(range(len(positions)))
            index_bytes = struct.pack("<" + "I" * len(index_values), *index_values)
            pos_view = append_view(position_bytes, 34962)
            normal_view = append_view(normal_bytes, 34962)
            index_view = append_view(index_bytes, 34963)
            pos_id = len(accessors)
            accessors.append({
                "bufferView": pos_view, "componentType": 5126, "count": len(positions),
                "type": "VEC3",
                "min": [min(p[i] for p in positions) for i in range(3)],
                "max": [max(p[i] for p in positions) for i in range(3)],
            })
            normal_id = len(accessors)
            accessors.append({"bufferView": normal_view, "componentType": 5126, "count": len(normals), "type": "VEC3"})
            index_id = len(accessors)
            accessors.append({
                "bufferView": index_view, "componentType": 5125,
                "count": len(index_values), "type": "SCALAR",
                "min": [0], "max": [len(index_values) - 1],
            })
            primitives.append({
                "attributes": {"POSITION": pos_id, "NORMAL": normal_id},
                "indices": index_id,
                "material": material_ids[name],
            })

        while len(binary) % 4:
            binary.append(0)
        document = {
            "asset": {"version": "2.0", "generator": "TERA illustrative product model generator"},
            "scene": 0,
            "scenes": [{"nodes": [0]}],
            "nodes": [{"mesh": 0, "name": path.stem}],
            "meshes": [{"primitives": primitives}],
            "materials": materials,
            "buffers": [{"byteLength": len(binary)}],
            "bufferViews": buffer_views,
            "accessors": accessors,
        }
        json_chunk = json.dumps(document, separators=(",", ":")).encode("utf-8")
        json_chunk += b" " * ((4 - len(json_chunk) % 4) % 4)
        binary_chunk = bytes(binary)
        total_size = 12 + 8 + len(json_chunk) + 8 + len(binary_chunk)
        with path.open("wb") as file:
            file.write(struct.pack("<4sII", b"glTF", 2, total_size))
            file.write(struct.pack("<I4s", len(json_chunk), b"JSON"))
            file.write(json_chunk)
            file.write(struct.pack("<I4s", len(binary_chunk), b"BIN\x00"))
            file.write(binary_chunk)


def dev_board(model, width, depth, color="green", rows=2, count=10):
    model.board(width, depth, color)
    model.pin_rows(count, width, depth, rows)
    model.chip(-width * 0.08, -depth * 0.05, width * 0.28, depth * 0.28)
    model.chip(width * 0.25, depth * 0.16, width * 0.12, depth * 0.16, 0.06, "dark")
    model.usb(-width * 0.39, depth * 0.36, width * 0.22)
    model.led(width * 0.32, -depth * 0.25)
    model.box((-width * 0.34, 0.10, -depth * 0.30), (width * 0.13, 0.13, depth * 0.15), "black")


def display_module(model, width, height, color, rows=0, cols=0):
    model.box((0, 0, 0), (width, height, 0.10), "black")
    model.box((0, 0, 0.055), (width * 0.88, height * 0.82, 0.018), color)
    if rows and cols:
        for row in range(rows):
            for col in range(cols):
                x = (col - (cols - 1) / 2) * width * 0.70 / cols
                y = (row - (rows - 1) / 2) * height * 0.5 / rows
                model.box((x, y, 0.069), (width * 0.025, height * 0.045, 0.006), "white")
    model.box((0, -height * 0.58, 0), (width * 0.82, 0.08, 0.08), "green")
    for i in range(8):
        x = (i - 3.5) * width * 0.085
        model.cylinder((x, -height * 0.62, 0), (x, -height * 0.78, 0), 0.009, "gold", 7)


def make_model(product_id):
    m = Model()
    if product_id == 1:
        dev_board(m, 1.12, 0.88, "blue", 2, 14)
        m.chip(0.08, 0.05, 0.25, 0.22, 0.10)
        m.box((-0.38, 0.12, 0.29), (0.29, 0.19, 0.25), "silver")
        m.box((0.42, 0.12, -0.16), (0.20, 0.12, 0.18), "black")
    elif product_id == 2:
        dev_board(m, 0.92, 0.50, "blue", 2, 18)
        m.box((0, 0.13, -0.04), (0.43, 0.15, 0.31), "silver")
        m.box((0, 0.13, 0.19), (0.34, 0.018, 0.07), "gold")
    elif product_id == 3:
        dev_board(m, 0.95, 0.42, "green", 2, 20)
        m.usb(0, 0.19, 0.20)
        m.chip(0.05, -0.02, 0.22, 0.18, 0.07)
        for i in range(5):
            m.box((0.28, 0.055, (i - 2) * 0.055), (0.08, 0.012, 0.026), "silver")
    elif product_id == 4:
        dev_board(m, 0.95, 0.40, "blue", 2, 20)
        m.chip(0, 0, 0.30, 0.24, 0.07)
        for i in range(5):
            m.box((-0.30, 0.055, (i - 2) * 0.055), (0.11, 0.01, 0.025), "silver")
    elif product_id == 5:
        dev_board(m, 1.05, 0.57, "blue", 2, 14)
        m.box((0, 0.13, -0.04), (0.45, 0.16, 0.32), "silver")
        m.box((0, 0.14, 0.20), (0.40, 0.02, 0.08), "gold")
        m.usb(-0.43, 0.19, 0.18)
    elif product_id == 6:
        m.box((0, 0.44, 0), (0.58, 0.84, 0.40), "white")
        for i in range(7):
            m.box((0, 0.62 - i * 0.12, 0.205), (0.36, 0.025, 0.012), "dark")
        for i in range(4):
            x = (i - 1.5) * 0.11
            m.cylinder((x, 0.02, 0), (x, -0.38, 0), 0.012, "silver", 7)
    elif product_id == 7:
        m.board(0.95, 0.55, "blue")
        for x in (-0.25, 0.25):
            m.cylinder((x, 0.08, 0), (x, 0.28, 0), 0.22, "silver", 28)
            m.cylinder((x, 0.281, 0), (x, 0.29, 0), 0.16, "dark", 24)
            m.cylinder((x, 0.291, 0), (x, 0.30, 0), 0.12, "silver", 24)
        m.pin_rows(4, 0.45, 0.36, 1)
    elif product_id == 8:
        m.board(0.64, 0.55, "purple")
        m.chip(0, 0, 0.28, 0.26, 0.11)
        m.chip(-0.20, 0.16, 0.10, 0.08, 0.05, "dark")
        m.pin_rows(8, 0.58, 0.48, 2)
    elif product_id == 9:
        m.board(0.48, 0.46, "green")
        m.box((0, 0.25, 0), (0.40, 0.32, 0.35), "white")
        m.sphere((0, 0.58, 0), (0.36, 0.32, 0.34), "cream", 12, 24)
        m.chip(0, 0.09, 0.16, 0.14, 0.05)
        m.pin_rows(3, 0.40, 0.35, 1)
    elif product_id == 10:
        m.board(0.50, 0.40, "blue")
        m.chip(0, 0, 0.24, 0.20, 0.07)
        m.chip(-0.15, 0.12, 0.09, 0.07, 0.05, "silver")
        m.pin_rows(8, 0.44, 0.35, 2)
    elif product_id == 11:
        m.board(0.75, 0.55, "blue")
        m.box((0, 0.13, 0), (0.42, 0.16, 0.32), "silver")
        m.box((0, 0.135, 0.18), (0.34, 0.02, 0.07), "gold")
        m.chip(-0.24, -0.15, 0.12, 0.11, 0.06)
        m.pin_rows(6, 0.69, 0.48, 2)
    elif product_id == 12:
        m.board(0.76, 0.52, "red")
        m.chip(-0.15, 0, 0.20, 0.18, 0.08)
        m.cylinder((0.20, 0.06, 0.12), (0.20, 0.62, 0.12), 0.025, "black", 10)
        for i in range(6):
            m.cylinder((0.20, 0.16 + i * 0.06, 0.12), (0.20, 0.18 + i * 0.06, 0.12), 0.055, "copper", 12)
        m.pin_rows(8, 0.68, 0.45, 2)
    elif product_id == 13:
        m.board(0.74, 0.58, "blue")
        m.box((0, 0.13, 0), (0.48, 0.12, 0.40), "gold")
        m.box((0, 0.20, 0), (0.36, 0.025, 0.30), "cream")
        m.chip(-0.24, -0.18, 0.12, 0.10, 0.06)
        m.pin_rows(8, 0.68, 0.52, 2)
    elif product_id == 14:
        m.board(0.76, 0.50, "blue")
        m.chip(-0.18, 0, 0.20, 0.20, 0.08)
        for i in range(4):
            m.box((0.20 + i * 0.045, 0.07, 0), (0.018, 0.03, 0.30), "gold")
        m.cylinder((0.28, 0.05, -0.12), (0.28, 0.58, -0.12), 0.025, "black", 10)
        m.pin_rows(8, 0.70, 0.44, 2)
    elif product_id == 15:
        display_module(m, 0.90, 0.66, "screen")
        m.box((0, -0.42, 0), (0.75, 0.05, 0.09), "blue")
    elif product_id == 16:
        display_module(m, 1.10, 0.82, "screen")
        m.box((0, 0, 0.067), (0.88, 0.63, 0.012), "display")
        m.box((0, -0.50, 0), (0.94, 0.08, 0.10), "blue")
    elif product_id == 17:
        display_module(m, 1.12, 0.54, "lcd", 2, 16)
        m.box((0, 0, 0.075), (0.92, 0.36, 0.012), "lcd")
        for row in range(2):
            for col in range(12):
                x = (col - 5.5) * 0.06
                y = (row - 0.5) * 0.12
                m.box((x, y, 0.086), (0.035, 0.045, 0.008), "green")
    elif product_id == 18:
        m.box((0, 0.42, 0), (0.34, 0.50, 0.14), "black")
        m.box((0, 0.76, -0.02), (0.62, 0.20, 0.035), "silver")
        m.cylinder((0, 0.70, -0.05), (0, 0.70, -0.01), 0.07, "dark", 16)
        for x in (-0.11, 0, 0.11):
            m.cylinder((x, 0.17, 0), (x, -0.26, 0), 0.018, "silver", 8)
    elif product_id == 19:
        m.board(0.74, 0.48, "red")
        m.chip(0, 0, 0.24, 0.20, 0.08)
        m.usb(-0.26, 0.16, 0.20)
        m.led(0.20, -0.12, "red_led")
        m.led(0.29, -0.12, "blue_led")
        m.pin_rows(4, 0.64, 0.40, 1)
    elif product_id == 20:
        m.box((0, 0.72, 0), (0.86, 1.35, 0.34), "yellow")
        m.box((0, 1.12, 0.18), (0.66, 0.32, 0.025), "screen")
        m.box((0, 1.12, 0.198), (0.50, 0.17, 0.008), "lcd")
        m.cylinder((0, 0.66, 0.18), (0, 0.68, 0.29), 0.23, "dark", 24)
        m.cylinder((0, 0.66, 0.29), (0, 0.68, 0.31), 0.16, "silver", 24)
        m.cylinder((0, 0.68, 0.31), (0, 0.70, 0.36), 0.045, "black", 12)
        for x in (-0.23, 0, 0.23):
            m.cylinder((x, 0.12, 0.18), (x, 0.24, 0.24), 0.055, "black", 12)
    elif product_id == 21:
        m.box((0, 0.30, 0), (1.10, 0.54, 0.62), "dark")
        m.box((-0.20, 0.36, 0.32), (0.42, 0.20, 0.02), "screen")
        m.box((-0.20, 0.36, 0.334), (0.28, 0.10, 0.008), "display")
        m.cylinder((0.32, 0.34, 0.30), (0.32, 0.34, 0.39), 0.13, "silver", 20)
        m.cylinder((0.32, 0.34, 0.39), (0.32, 0.34, 0.43), 0.08, "black", 16)
        m.cylinder((0.40, 0.44, 0.05), (0.84, 0.76, 0.05), 0.07, "black", 14)
        m.cylinder((0.84, 0.76, 0.05), (1.02, 0.90, 0.05), 0.025, "silver", 12)
    elif product_id == 22:
        m.box((0, 0.07, 0), (1.32, 0.14, 0.90), "white")
        m.box((0, 0.148, 0), (1.20, 0.018, 0.58), "cream")
        for row in range(8):
            for col in range(17):
                x = (col - 8) * 0.066
                z = (row - 3.5) * 0.065
                m.cylinder((x, 0.16, z), (x, 0.17, z), 0.012, "dark", 7)
        for z in (-0.39, 0.39):
            m.box((0, 0.16, z), (1.20, 0.025, 0.06), "red" if z > 0 else "blue")
    elif product_id == 23:
        m.box((0, 0.07, 0), (1.30, 0.14, 0.90), "cream")
        m.box((-0.24, 0.14, -0.10), (0.86, 0.025, 0.56), "white")
        dev_board(m, 0.68, 0.48, "blue", 2, 10)
        for i in range(6):
            x = (i - 2.5) * 0.10
            m.cylinder((x, 0.08, 0.28), (x, 0.30, 0.28), 0.018, "copper", 8)
            m.sphere((x, 0.31, 0.28), (0.027, 0.027, 0.027), "red_led", 6, 8)
    elif product_id == 24:
        dev_board(m, 0.86, 0.60, "green", 2, 12)
        m.box((0, 0.13, -0.05), (0.30, 0.14, 0.22), "silver")
        m.sphere((-0.29, 0.20, 0.12), (0.11, 0.15, 0.11), "white", 9, 14)
        m.cylinder((0.31, 0.06, -0.16), (0.31, 0.38, -0.16), 0.045, "black", 10)
    elif product_id == 25:
        m.box((0, 0.24, 0), (1.10, 0.18, 0.72), "red")
        for x in (-0.43, 0.43):
            for z in (-0.38, 0.38):
                m.cylinder((x - 0.10, 0.22, z), (x + 0.10, 0.22, z), 0.23, "black", 20)
                m.cylinder((x + 0.101, 0.22, z), (x + 0.12, 0.22, z), 0.12, "silver", 16)
        m.board(0.52, 0.35, "blue")
        m.cylinder((-0.20, 0.12, 0.46), (-0.20, 0.30, 0.46), 0.12, "silver", 20)
        m.cylinder((0.20, 0.12, 0.46), (0.20, 0.30, 0.46), 0.12, "silver", 20)
    elif product_id == 26:
        m.board(1.15, 0.86, "green")
        m.chip(-0.05, 0, 0.32, 0.28, 0.10)
        m.box((-0.05, 0.13, 0), (0.42, 0.08, 0.36), "silver")
        for x in (-0.43, -0.18):
            m.box((x, 0.12, 0.49), (0.34, 0.18, 0.18), "silver")
        m.box((0.35, 0.12, 0.46), (0.30, 0.18, 0.20), "silver")
        m.pin_rows(20, 0.90, 0.72, 2)
    elif product_id == 27:
        m.box((0, 0.11, 0), (1.25, 0.22, 0.86), "cream")
        for row in range(3):
            for col in range(6):
                x = (col - 2.5) * 0.17
                z = (row - 1) * 0.22
                m.cylinder((x - 0.06, 0.28, z), (x + 0.06, 0.28, z), 0.035, "copper", 10)
                m.cylinder((x - 0.16, 0.28, z), (x - 0.06, 0.28, z), 0.008, "silver", 6)
                m.cylinder((x + 0.06, 0.28, z), (x + 0.16, 0.28, z), 0.008, "silver", 6)
    elif product_id == 28:
        m.box((0, 0.10, 0), (1.15, 0.20, 0.82), "cream")
        colors = ("black", "blue", "red", "green", "silver", "gold")
        for row in range(3):
            for col in range(5):
                x = (col - 2) * 0.20
                z = (row - 1) * 0.22
                height = 0.22 + 0.04 * ((row + col) % 3)
                material = colors[(row * 2 + col) % len(colors)]
                m.cylinder((x, 0.20, z), (x, 0.20 + height, z), 0.055, material, 12)
                m.cylinder((x, 0.20 + height, z), (x, 0.34 + height, z), 0.009, "silver", 6)
    else:
        raise ValueError(f"No model generator for product id {product_id}")
    return m


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for product_id in range(1, 29):
        path = OUTPUT / f"product-{product_id}.glb"
        make_model(product_id).add_gltf(path)
    print(f"Generated 28 illustrative GLB models in {OUTPUT}")


if __name__ == "__main__":
    main()
