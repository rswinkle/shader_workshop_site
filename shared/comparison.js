/**
 * Feature comparison table data + renderer for Shader Workshop site variants.
 * Ratings: yes | partial | no | unknown
 */
(function (global) {
  "use strict";

  var COLS = ["Shadertoy", "FragCoord", "Shader Workshop"];
  var LINKS = {
    Shadertoy: "https://www.shadertoy.com",
    FragCoord: "https://fragcoord.xyz",
    "Shader Workshop": "https://shaderworkshop.com",
  };

  var SECTIONS = [
    {
      title: "Core rendering",
      rows: [
        ["Image pass (mainImage / equivalent)", "yes", "yes", "yes"],
        ["Multipass buffers (A–D style)", "yes", "yes", "yes"],
        ["Float multipass storage (e.g. RGBA32F)", "yes", "yes", "yes"],
        ["Independent per-pass resolution", "partial", "yes", "yes"],
        ["Whole-buffer / full-frame control (CPU SIMD, custom frame loop)", "no", "no", "yes"],
        ["Built-in pass recursion (N iterations per frame)", "no", "yes", "yes"],
        ["Multiple render targets (MRT)", "no", "yes", "no"],
        ["GPU compute passes", "no", "yes", "no"],
        ["Writable 1D / volume pass buffers", "no", "yes", "no"],
      ],
    },
    {
      title: "Audio",
      rows: [
        ["Procedural sound-out (mainSound)", "yes", "no", "yes"],
        ["Music / analysis texture (classic 512×2 FFT + wave)", "yes", "unknown", "yes"],
        ["Always-on audio history (512×512 spectrogram)", "no", "yes", "yes"],
        ["Microphone input", "yes", "yes", "yes"],
        ['Live post-mix / "what you hear" analysis', "no", "unknown", "yes"],
      ],
    },
    {
      title: "Video, camera & capture",
      rows: [
        ["Webcam", "yes", "yes", "yes"],
        ["Screen capture as input", "no", "yes", "yes"],
        ["Video file textures", "yes", "yes", "yes"],
        ["Built-in freefly camera uniforms", "no", "yes", "yes"],
      ],
    },
    {
      title: "Inputs & media",
      rows: [
        ["Keyboard", "yes", "yes", "yes"],
        ["Mouse (position / click / drag style)", "yes", "yes", "yes"],
        ["Cubemap textures (static assets)", "yes", "yes", "yes"],
        ["Procedural cubemap pass (CubeA / mainCubemap)", "yes", "yes", "no"],
        ["3D volume textures", "yes", "yes", "yes"],
        ["Custom local / URL media", "partial", "yes", "yes"],
        ["Previous-canvas feedback without a free buffer (u_main)", "partial", "yes", "yes"],
      ],
    },
    {
      title: "Playback, export & authoring",
      rows: [
        ["Pause / time scrub / FPS control", "partial", "yes", "yes"],
        ["Global canvas resolution control", "partial", "yes", "yes"],
        ["Screenshots", "yes", "yes", "yes"],
        ["Video export", "partial", "yes", "yes"],
        ["Audio-only export", "no", "unknown", "yes"],
        ["Custom parameters UI", "partial", "yes", "yes"],
        ["In-browser GLSL (or multi-lang) editor", "yes", "yes", "no"],
        ["Offline native app / local binaries", "no", "no", "yes"],
        ["CPU software path (no GPU required to run)", "no", "no", "yes"],
      ],
    },
    {
      title: "Analysis, community & niche",
      rows: [
        ["Expression inspect / intermediate visualization", "no", "yes", "no"],
        ["NaN / Inf / OOR pixel flags", "no", "yes", "no"],
        ["Instruction / cost heatmap", "no", "yes", "no"],
        ["Frame-time history graph", "no", "yes", "yes"],
        ["Social explore / likes / publish", "yes", "yes", "no"],
        ["SoundCloud integration", "no", "yes", "no"],
        ["VR pass (mainVR)", "yes", "no", "no"],
        ['Shared "Common" / snippet library', "yes", "yes", "yes"],
        ["MIP-mapped sampling modes", "yes", "yes", "partial"],
      ],
    },
  ];

  var LABELS = {
    yes: { emoji: "🟢", text: "Yes", title: "Solid, first-class support" },
    partial: { emoji: "🟡", text: "Partial", title: "Present but limited, awkward, incomplete, or unreliable" },
    no: { emoji: "🔴", text: "No", title: "Not offered in a useful form" },
    unknown: { emoji: "—", text: "—", title: "Unknown / not scored without a solid public source" },
  };

  function badge(rating) {
    var info = LABELS[rating] || LABELS.unknown;
    return (
      '<span class="cmp-badge cmp-' +
      rating +
      '" title="' +
      info.title +
      '">' +
      '<span class="cmp-emoji" aria-hidden="true">' +
      info.emoji +
      "</span>" +
      '<span class="cmp-label">' +
      info.text +
      "</span></span>"
    );
  }

  function colHeader(name) {
    var href = LINKS[name];
    var highlight = name === "Shader Workshop" ? ' class="cmp-highlight-col"' : "";
    if (href) {
      return "<th" + highlight + '><a href="' + href + '" target="_blank" rel="noopener">' + name + "</a></th>";
    }
    return "<th" + highlight + ">" + name + "</th>";
  }

  function renderTable() {
    var html = "";
    for (var s = 0; s < SECTIONS.length; s++) {
      var sec = SECTIONS[s];
      html += '<div class="cmp-section">';
      html += "<h3 class=\"cmp-section-title\">" + sec.title + "</h3>";
      html += '<div class="cmp-table-wrap"><table class="cmp-table">';
      html += "<thead><tr><th class=\"cmp-feature-col\">Feature</th>";
      for (var c = 0; c < COLS.length; c++) html += colHeader(COLS[c]);
      html += "</tr></thead><tbody>";
      for (var r = 0; r < sec.rows.length; r++) {
        var row = sec.rows[r];
        html += "<tr><td class=\"cmp-feature\">" + row[0] + "</td>";
        for (var i = 1; i < row.length; i++) {
          var hl = COLS[i - 1] === "Shader Workshop" ? ' class="cmp-highlight-col"' : "";
          html += "<td" + hl + ">" + badge(row[i]) + "</td>";
        }
        html += "</tr>";
      }
      html += "</tbody></table></div></div>";
    }
    return html;
  }

  function renderLegend() {
    return (
      '<ul class="cmp-legend">' +
      '<li><span class="cmp-badge cmp-yes"><span class="cmp-emoji">🟢</span><span class="cmp-label">Yes</span></span> solid, first-class support</li>' +
      '<li><span class="cmp-badge cmp-partial"><span class="cmp-emoji">🟡</span><span class="cmp-label">Partial</span></span> limited, awkward, incomplete, or unreliable</li>' +
      '<li><span class="cmp-badge cmp-no"><span class="cmp-emoji">🔴</span><span class="cmp-label">No</span></span> not offered in a useful form</li>' +
      '<li><span class="cmp-badge cmp-unknown"><span class="cmp-emoji">—</span><span class="cmp-label">—</span></span> unknown / not scored</li>' +
      "</ul>"
    );
  }

  function renderSummary() {
    return (
      '<div class="cmp-summary">' +
      "<p><strong>Shadertoy</strong> — Reference community GLSL multipass site (buffers, CubeA, social).</p>" +
      "<p><strong>FragCoord</strong> — Browser analysis / authoring IDE (inspect, heatmap, tuner, recursion, MRT / compute / non-2D buffers, full media catalog).</p>" +
      "<p><strong>Shader Workshop</strong> — Offline C/C++ runtime: multipass/float/res, media, freefly, recursion, mipmapped static textures, Speed-tab frame graph, export — <em>no GPU required</em>.</p>" +
      "</div>"
    );
  }

  function officialComparisonHref() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src") || "";
      if (src.indexOf("comparison.js") !== -1) {
        return src.replace("comparison.js", "Official_Feature_Comparison.html");
      }
    }
    return "shared/Official_Feature_Comparison.html";
  }

  function mount(selector) {
    var el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!el) return;
    var details = officialComparisonHref();
    el.innerHTML =
      '<div class="cmp-root">' +
      renderLegend() +
      renderSummary() +
      renderTable() +
      '<p class="cmp-footnote">Ratings describe support for that feature, not overall product quality. ' +
      'Full notes: <a href="' +
      details +
      '">detailed comparison</a>. ' +
      'Corrections welcome via the <a href="https://github.com/rswinkle/shader_workshop_tracker" target="_blank" rel="noopener">issue tracker</a>.</p>' +
      "</div>";
  }

  global.SWComparison = { mount: mount, SECTIONS: SECTIONS, COLS: COLS };
})(typeof window !== "undefined" ? window : this);
