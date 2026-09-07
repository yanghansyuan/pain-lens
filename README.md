# Pain Lens

Pain Lens is a local interactive pain-oriented anatomy viewer. It includes two preserved versions:

- `pain-atlas-tw/`: the newer Human Atlas based 3D anatomy viewer with Traditional Chinese UI, structure hiding, transparent location highlighting, and embedded YouTube rehabilitation previews.
- `static-dist/`: the earlier pain marking prototype kept as a reference.

## Run Locally

### New Human Atlas version

```powershell
cd D:\Personal\MuscleFinder\pain-atlas-tw
npm install
npm run dev
```

Production preview after build:

```powershell
cd D:\Personal\MuscleFinder\pain-atlas-tw
npm run build
npm run serve
```

Open http://127.0.0.1:3016/

### Old prototype

```powershell
cd D:\Personal\MuscleFinder
node serve-static.mjs
```

Open http://127.0.0.1:3000/

## Notes

This is an educational pain location and anatomy exploration tool. It is not a medical diagnosis tool and should not replace care from a physician or physical therapist.

The newer viewer is based on the Human Atlas project and BodyParts3D data. See the in-app source and license panel for dataset attribution.
