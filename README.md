# joncms95.github.io

My GitHub Page

## Emergent AI (`emergent-ai/` on GitHub Pages)

- **`emergent-ai-source/`** — git submodule → [joncms95/emergent-ai](https://github.com/joncms95/emergent-ai) (Create React App source).
- **`emergent-ai/`** — production static files copied from `emergent-ai-source/build/`. This is what `https://joncms95.github.io/emergent-ai/` serves.

The submodule’s `package.json` already sets `"homepage": "https://joncms95.github.io/emergent-ai"` so asset URLs stay correct.

### Update the live Emergent app after changing the submodule repo

```bash
git submodule update --init --recursive
cd emergent-ai-source
git pull origin main
cd ..
git add emergent-ai-source
yarn --cwd emergent-ai-source install --frozen-lockfile
CI=false GENERATE_SOURCEMAP=false yarn --cwd emergent-ai-source build
rm -rf emergent-ai && mkdir -p emergent-ai && cp -a emergent-ai-source/build/. emergent-ai/
git add emergent-ai
git commit -m "Bump emergent-ai submodule and sync build"
git push
```

Or rely on **GitHub Actions** (`.github/workflows/sync-emergent-ai.yml`): when you push a commit that updates the `emergent-ai-source` submodule pointer (or `.gitmodules` / the workflow file), the workflow rebuilds and commits an updated `emergent-ai/` if the build output changed.

### First-time clone of this repo

```bash
git clone --recurse-submodules https://github.com/joncms95/joncms95.github.io.git
# or, if already cloned:
git submodule update --init --recursive
```
