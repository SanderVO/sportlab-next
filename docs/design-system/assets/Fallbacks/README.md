# Fallbacks

Static images used when content has no picture of its own.

- `lesson-fallback.webp` (1440×840, the dark `panel-glow` → `charcoal` → `panel-deep` glow): the image for a lesson without `image` and without a template image. LessonCard and LessonThumb put the `SPORTLAB` wordmark on top as live text (`line-panel`), so the file stays the same in every language. Ship it with the web app and the React Native app as a local asset, so it never needs a network request.
