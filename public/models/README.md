# 3D vehicle models

Drop rigged **glTF 2.0 `.glb`** files here, named to match the `model` key in
`src/data/fleet.ts`:

| File                          | Vehicle                       |
| ----------------------------- | ----------------------------- |
| `e450-16-black.glb`           | Ford E-450 Shuttle · 16 (black) |
| `e450-20-white.glb`           | Ford E-450 Shuttle · 20 (white) |
| `escalade.glb`                | Cadillac Escalade             |
| `suburban.glb`                | Chevrolet Suburban            |
| `sprinter.glb`                | Mercedes-Benz Sprinter        |

## Requirements
- **Format:** `.glb` (glTF 2.0). Convert FBX/OBJ/blend in Blender → *Export → glTF (.glb)*.
- **Openable doors:** doors must be **separate meshes whose name contains "door"**
  (e.g. `Door_FL`, `SlidingDoor_R`). The viewer auto-detects and swings them on click.
- Real-world scale, centered origin, embedded PBR textures, optimized
  (Draco/meshopt), ideally < 15–25 MB each.

## Turning one on
After committing a file here, add its key to `READY_MODELS` in
`src/components/Showroom3D.tsx` (one line). Until then, that vehicle shows the
placeholder geometry so the showroom always works.
