// Rebuild pass: convert an authored page into a composition of the cm-* shared components.
// Used by run_script. Every page is checked for balance before it is written; a page that
// fails any assertion is reported and left untouched.

export const NAV = '<div style="position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #ebebeb">';
export const END = '</nav>\n</div>\n</div>\n';
export const TOC = '<div style="background:#fafafa;border-bottom:1px solid #ebebeb">';
export const BAR36 = '<div style="width:36px;height:4px;background:#1de9b6;border-radius:999px;margin-bottom:14px"></div>\n';
export const BAR52 = /^<div style="width:52px;height:5px;background:#1de9b6;border-radius:999px;margin-bottom:20px"><\/div>\n/;
export const HEAD = /^<div style="display:flex;align-items:baseline;gap:12px[^"]*"><span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:400;letter-spacing:\.1em">ss: (\d\d)<\/span><h2 style="margin:0;font-weight:900;font-size:28px[^"]*">([^<]*)<\/h2><\/div>\n/;
export const H1 = /^<h1 style="[^"]*">([\s\S]*?)<\/h1>\n/;
export const CALLOUT = /<div style="display:flex;gap:14px;align-items:baseline;font-size:14px;line-height:1\.8"><img src="icons\/set\/([a-z-]+)-[of]\.svg"[^>]*><span style="[^"]*">([^<]+)<\/span><span style="font-weight:400">([\s\S]*?)<\/span><\/div>/g;
export const MONOTBL = '<div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.06);font-family:\'JetBrains Mono\',monospace">';
export const TBLTITLE = /<div style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;letter-spacing:\.02em;text-transform:uppercase;margin-bottom:12px">([^<]*)<\/div>\n$/;
