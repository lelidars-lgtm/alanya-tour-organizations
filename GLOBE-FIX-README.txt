SPECIAL OFFERS — 3D GLOBE V2

What was fixed after checking the published screenshot:
1. Removed the static uploaded globe image that was still embedded in CSS on .globe-stage-live::before.
   That flat image was sitting behind the WebGL canvas and visually dominated the result.
2. The WebGL canvas is now the only Earth surface during the live globe scene.
3. Increased side-lighting, shadow contrast, rim atmosphere and specular highlight so the sphere reads clearly as volume.
4. Added a small permanent axial tilt to make rotation/curvature easier to perceive.
5. Final Türkiye-state bokeh remains intact.

Upload ALL files and folders, preserving assets/globe/.
Then hard-refresh the published page with Ctrl+F5.
