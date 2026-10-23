#!/usr/bin/env bash
# Netlify "ignore" check (netlify.toml → build.ignore): exit 0 skips the build,
# exit 1 builds. Saves build credits:
#  - deploy previews and branch deploys never build (also switch them off in
#    Site configuration → Build & deploy → Branches and deploy contexts);
#  - a push to main builds only when something that ends up on the site changed.
case "$CONTEXT" in
  deploy-preview|branch-deploy)
    echo "Skipping the $CONTEXT build: previews and branch deploys are off to save build credits."
    exit 0 ;;
esac
# First build, cleared cache or a manual "Trigger deploy": always build
if [ -z "${CACHED_COMMIT_REF:-}" ] || [ "$CACHED_COMMIT_REF" = "$COMMIT_REF" ]; then exit 1; fi
# Anything that goes into the site (if git can't compare, it builds)
if git diff --quiet "$CACHED_COMMIT_REF" "$COMMIT_REF" -- src public astro.config.mjs package.json package-lock.json tsconfig.json netlify.toml; then
  echo "Nothing on the site changed since the last deploy (${CACHED_COMMIT_REF:0:7}..${COMMIT_REF:0:7}); skipping the build."
  exit 0
fi
exit 1
