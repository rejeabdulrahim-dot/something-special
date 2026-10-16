# Chapter One handoff — 16 October 2026

This work is in `C:/Users/edith/Documents/ChatGPT/anniversary website`.
The Desktop project is unchanged. No later chapter was added.

## Preserved opening

All HTML before the story, all existing inline CSS, and the complete opening JavaScript are byte-identical to the start-of-task baseline. Password handling, the light transition, hero video, counter delays, final emphasis, labels, dates and scroll indicator were not edited.

## Birthday video

| Property | Original master | Web copy |
| --- | --- | --- |
| Path | `renamed_videos/kishas_birthday.mp4` | `renamed_videos/kishas_birthday_web.mp4` |
| Bytes | 1,055,798,158 | 47,657,577 |
| Size (decimal MB) | 1,055.80 MB (1.056 GB) | 47.66 MB |
| Resolution | 1080 x 2340 portrait | 576 x 1248 portrait |
| Aspect ratio | 6:13 | 6:13; square pixels |
| Video | H.264 Main, yuv420p | H.264 High, yuv420p |
| Frame rate | Variable; average 28.0356 fps | Variable; average 28.0505 fps |
| Video frames | 11,561 | 11,561 |
| Container duration | 6:52.44 | 6:52.22 |
| Audio | AAC LC, 48 kHz stereo, about 192 kb/s | AAC LC, 48 kHz stereo, 128 kb/s target; about 90 kb/s measured |
| Overall bitrate | About 20,479 kb/s | About 924 kb/s |
| Metadata order | moov after media | moov before media (faststart) |

Reduction: **95.49%**. Source/master SHA-256 is unchanged:
`e8ab7e2eb7080a5f6d3434e682dba4ed697ba180c33857848b17877cde5e5450`.

The exact 6:13 ratio fits inside a 720 x 1280 portrait bounding box at 576 x 1248 without cropping, stretching or upscaling. CRF 24 balances detail and download size. The medium-preset trial ran at about 0.3x real time, so it was stopped early; the final encode restarted from the original using veryfast at the same CRF. No compressed output was used as an input.

The final variable-frame-rate timestamps were rounded to the encoder time base. This accounts for the approximately 0.22-second container-duration difference; every source video frame remains, and the full audio track is present. Side-by-side frames at 30, 150 and 300 seconds were visually reviewed. The complete output video and audio decoded with zero errors. At 47.66 MB for nearly seven minutes, another quality-reducing encode was not warranted.

FFmpeg 7.1 was provided by an isolated `imageio-ffmpeg==0.6.0` PyPI wheel in the task's tools directory. There were no system/PATH changes and no website runtime dependencies added. Tool source: [ImageIO FFmpeg on PyPI](https://pypi.org/project/imageio-ffmpeg/). [Official FFmpeg format options](https://ffmpeg.org/ffmpeg-formats.html).

Equivalent reproduction command, omitting only the task-specific progress log:

```text
ffmpeg -hide_banner -nostdin -n -i renamed_videos/kishas_birthday.mp4 -map 0:v:0 -map 0:a:0 -vf scale=576:1248:flags=lanczos,setsar=1 -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p -fps_mode vfr -force_key_frames expr:gte(t,n_forced*2) -threads 4 -c:a aac -b:a 128k -movflags +faststart -map_metadata -1 -nostats renamed_videos/kishas_birthday_web.mp4
```

Both `data-src` and the HTML fallback link target the web copy. The error fallback in `story.js` also uses that same web path. No original-master URL remains in the page. `preload="none"` and assigning `src` only on interaction prevent any birthday media requests during entry or scrolling.

Clicking/tapping the birthday photo opens the native dialog and intentionally starts playback with audio. Controls and playsinline remain enabled; looping remains disabled. Close and Escape pause playback, restore scrolling and return focus. Reopening resumes playback. A late play event after close is paused immediately.

## Milestones and assets

1. The first message — `Kisha_first_message.jpg`.
2. Just one more call — `Kisha_filter1.jpg`.
3. We had our moments too — `kisha_angry.jpg`.
4. And we kept going — `Kisha_peace_sign.jpg`.
5. Kisha's birthday — `kisha_birthday_pic.jpg`, opening the web video.
6. And there was beauty, too — `Kisha_flowers2.jpg`.
7. Closing anniversary destination — 365 days later; the existing road quote and “And we're still going.” No additional photo or chapter.

All photo filenames above are originals at the project root. The site displays the matching copies listed below. The original birthday video and all existing photos are untouched.

The two newly found Desktop flower photos show the same occasion. `Kisha_flowers2.jpg` was selected for its closer framing of Kisha and the bouquet, and copied unchanged into the workspace. `Kisha_flowers1.jpg` remains on the Desktop. There is no unresolved asset ambiguity.

The rough-stage wording acknowledges difficulty without inventing a specific argument, breakup or reconciliation. All relationship prose remains provisional. It can be edited directly in the corresponding article in `index.html`.

## Photo optimisation

JPEG copies use quality 84, progressive encoding and Lanczos resizing. No cropping was applied. Screenshot copies are 720 pixels wide; the birthday and flowers portraits are 900 pixels wide, sufficient for the small displayed cards and common high-density screens. Explicit HTML dimensions reserve layout space. Every story image remains lazy-loaded with asynchronous decoding.

| Original at project root | Original size | Displayed web copy | Web size | Dimensions |
| --- | --- | --- | --- | --- |
| `Kisha_first_message.jpg` | 864.6 KB | `images/web/Kisha_first_message_web.jpg` | 125.0 KB | 720 x 1560 |
| `Kisha_filter1.jpg` | 760.4 KB | `images/web/Kisha_filter1_web.jpg` | 81.8 KB | 720 x 1560 |
| `kisha_angry.jpg` | 669.4 KB | `images/web/kisha_angry_web.jpg` | 77.5 KB | 720 x 1560 |
| `Kisha_peace_sign.jpg` | 705.7 KB | `images/web/Kisha_peace_sign_web.jpg` | 75.8 KB | 720 x 1560 |
| `kisha_birthday_pic.jpg` | 661.3 KB | `images/web/kisha_birthday_pic_web.jpg` | 125.3 KB | 900 x 1200 |
| `Kisha_flowers2.jpg` | 1093.2 KB | `images/web/Kisha_flowers2_web.jpg` | 186.3 KB | 900 x 1200 |

Combined original size: 4.75 MB. Combined web size: 0.672 MB.

## Implementation decisions

`story.css` and `story.js` continue to own Chapter One. Normal document flow allows longer copy or additional articles without fixed timeline offsets. Rotations vary by stop. The rough-stage card has extra edge clearance at tablet and phone widths; flowers have more desktop breathing room.

The measured SVG path puts markers at changes of direction. Its rough-stage bend is stronger, and the road continues to the anniversary. Progress converts viewport height into actual distance along the curve using cached samples, rather than assuming curve length is proportional to section height. The scroll handler updates at most once per animation frame. Resize, font and image changes recalculate geometry. Phones use their own narrow path and stacked layout.

## Verification

- Original opening byte comparison: passed.
- Wrong password, clearing/error behavior, correct entry, white/light transition and hero playback: passed.
- Every counter value 1–365, rapid early counting, increasing 360–365 delays, 363/364 pauses, final emphasis, Days of Us, dates and scroll hint: passed.
- Hero-to-story scrolling, six loaded photos, intended memory order, rough-stage continuity, anniversary destination and restrained reveals: passed.
- Layouts at 1440 x 1000, 768 x 1024, 390 x 844 and 320 x 740: passed, with all tilted cards within the viewport and no horizontal scrollbar.
- Road progress alignment: within 2 pixels of the intended viewport position on desktop and phone widths.
- No birthday requests during initial loading or complete roadmap scrolling: passed.
- Web-video touch playback with decoded audio, native controls, original aspect ratio, no looping and inline playback at 320, 390 and 1440 widths: passed.
- Close, Escape, focus containment/restoration, scroll restoration, reopening, seeking to 150 seconds and rapid close without hidden audio: passed.
- Reduced motion: all content and the full road visible without reveal transitions.
- Entire compressed video/audio decoded without errors. All source video frames retained. Master size and SHA-256 unchanged.

Browser tests used installed Chrome on Windows, including mobile/touch emulation. No physical iOS/Android or Safari test was performed. Network requests were verified to use only the web birthday copy after interaction. The remaining performance consideration is the 47.66 MB full-video download on slow connections; it is deferred until opening and supports byte-range seeking.

## Files modified or created

Modified: `index.html`, `story.css`, `story.js`.

Created: `Kisha_flowers2.jpg` (unchanged copy of the Desktop original), the six JPEGs listed under `images/web/`, `renamed_videos/kishas_birthday_web.mp4`, and this `ROADMAP-NOTES.md`.

Encoding tools, trial output, comparison frames, screenshots and verification scripts/reports were kept in the task's separate visualizations directory, outside the website.
