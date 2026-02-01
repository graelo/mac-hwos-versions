(function () {
  "use strict";

  let versionIndex = [];
  let currentModels = [];
  let currentMode = "single"; // "single" or "range"

  // --- DOM refs ---
  const versionSelect = document.getElementById("version-select");
  const rangeMin = document.getElementById("range-min");
  const rangeMax = document.getElementById("range-max");
  const resultsDiv = document.getElementById("results");
  const errorDiv = document.getElementById("error");
  const downloadBtn = document.getElementById("download-btn");
  const modeSingleBtn = document.getElementById("mode-single");
  const modeRangeBtn = document.getElementById("mode-range");
  const singleControls = document.getElementById("single-controls");
  const rangeControls = document.getElementById("range-controls");

  // --- Init ---
  document.addEventListener("DOMContentLoaded", function () {
    loadIndex();
    modeSingleBtn.addEventListener("click", function () { setMode("single"); });
    modeRangeBtn.addEventListener("click", function () { setMode("range"); });
    versionSelect.addEventListener("change", onSingleChange);
    rangeMin.addEventListener("change", onRangeChange);
    rangeMax.addEventListener("change", onRangeChange);
    downloadBtn.addEventListener("click", onDownload);
  });

  function setMode(mode) {
    currentMode = mode;
    modeSingleBtn.classList.toggle("active", mode === "single");
    modeRangeBtn.classList.toggle("active", mode === "range");
    singleControls.classList.toggle("hidden", mode !== "single");
    rangeControls.classList.toggle("hidden", mode !== "range");
    if (mode === "single") {
      onSingleChange();
    } else {
      onRangeChange();
    }
  }

  // --- Data loading ---
  function loadIndex() {
    fetch("data/index.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load version index");
        return res.json();
      })
      .then(function (data) {
        versionIndex = data;
        populateSelectors();
        // Default to most recent version
        var last = versionIndex.length - 1;
        versionSelect.selectedIndex = last;
        rangeMin.selectedIndex = 0;
        rangeMax.selectedIndex = last;
        loadVersion(versionIndex[last].data_file);
      })
      .catch(function (err) {
        showError("Could not load version index. " + err.message);
      });
  }

  function populateSelectors() {
    [versionSelect, rangeMin, rangeMax].forEach(function (sel) {
      sel.innerHTML = "";
      versionIndex.forEach(function (v, i) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.textContent = v.version_name + " (" + v.version_number + ")";
        sel.appendChild(opt);
      });
    });
  }

  function loadVersion(filename) {
    clearError();
    fetch("data/" + filename)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + filename);
        return res.json();
      })
      .then(function (data) {
        currentModels = data.models || [];
        renderModels(currentModels);
      })
      .catch(function (err) {
        showError("Could not load version data. " + err.message);
      });
  }

  function loadVersionRange(minIdx, maxIdx) {
    clearError();
    if (minIdx > maxIdx) {
      var tmp = minIdx;
      minIdx = maxIdx;
      maxIdx = tmp;
      rangeMin.selectedIndex = minIdx;
      rangeMax.selectedIndex = maxIdx;
    }

    var files = [];
    for (var i = minIdx; i <= maxIdx; i++) {
      files.push(versionIndex[i].data_file);
    }

    var promises = files.map(function (f, idx) {
      return fetch("data/" + f)
        .then(function (res) {
          if (!res.ok) throw new Error(f);
          return res.json();
        })
        .then(function (data) {
          return { ok: true, models: data.models || [], file: f };
        })
        .catch(function () {
          return { ok: false, models: [], file: f };
        });
    });

    Promise.all(promises).then(function (results) {
      var failed = results.filter(function (r) { return !r.ok; });
      if (failed.length > 0) {
        var names = failed.map(function (r) { return r.file; }).join(", ");
        showError("Failed to load: " + names + ". Range results may be incomplete.");
      }

      var successful = results.filter(function (r) { return r.ok; });
      if (successful.length === 0) {
        currentModels = [];
        renderModels([]);
        return;
      }

      // Intersect by model_identifier
      var sets = successful.map(function (r) {
        var s = {};
        r.models.forEach(function (m) { s[m.model_identifier] = m; });
        return s;
      });

      var intersection = Object.keys(sets[0]).filter(function (id) {
        return sets.every(function (s) { return id in s; });
      });

      currentModels = intersection.map(function (id) { return sets[0][id]; });
      currentModels.sort(function (a, b) {
        if (a.product_line < b.product_line) return -1;
        if (a.product_line > b.product_line) return 1;
        if (a.release_date < b.release_date) return -1;
        if (a.release_date > b.release_date) return 1;
        return 0;
      });

      renderModels(currentModels);
    });
  }

  // --- Rendering ---
  function renderModels(models) {
    resultsDiv.innerHTML = "";
    if (models.length === 0) {
      resultsDiv.innerHTML = '<div class="empty-state">No compatible models found.</div>';
      return;
    }

    // Group by product_line
    var groups = {};
    var groupOrder = [];
    models.forEach(function (m) {
      if (!(m.product_line in groups)) {
        groups[m.product_line] = [];
        groupOrder.push(m.product_line);
      }
      groups[m.product_line].push(m);
    });

    groupOrder.forEach(function (line) {
      var section = document.createElement("div");
      section.className = "product-line-group";

      var heading = document.createElement("h2");
      heading.textContent = line;
      section.appendChild(heading);

      var table = document.createElement("table");
      table.className = "compat-table";

      var thead = document.createElement("thead");
      thead.innerHTML =
        "<tr>" +
        "<th>Model</th>" +
        "<th>Identifier</th>" +
        "<th>Architecture</th>" +
        "<th>Released</th>" +
        "</tr>";
      table.appendChild(thead);

      var tbody = document.createElement("tbody");
      groups[line].forEach(function (m) {
        var tr = document.createElement("tr");
        var archClass = m.cpu_architecture === "arm64" ? "badge-apple-silicon" : "badge-intel";
        var archLabel = m.cpu_architecture === "arm64" ? "Apple Silicon" : "Intel";
        tr.innerHTML =
          "<td>" + escapeHtml(m.short_name) + "</td>" +
          "<td><code>" + escapeHtml(m.model_identifier) + "</code></td>" +
          '<td><span class="badge ' + archClass + '">' + archLabel + "</span></td>" +
          "<td>" + escapeHtml(m.release_date) + "</td>";
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      section.appendChild(table);
      resultsDiv.appendChild(section);
    });
  }

  // --- Events ---
  function onSingleChange() {
    var idx = parseInt(versionSelect.value, 10);
    if (!isNaN(idx) && versionIndex[idx]) {
      loadVersion(versionIndex[idx].data_file);
    }
  }

  function onRangeChange() {
    var minIdx = parseInt(rangeMin.value, 10);
    var maxIdx = parseInt(rangeMax.value, 10);
    if (!isNaN(minIdx) && !isNaN(maxIdx)) {
      loadVersionRange(minIdx, maxIdx);
    }
  }

  function onDownload() {
    if (currentModels.length === 0) return;
    var filename;
    if (currentMode === "single") {
      var idx = parseInt(versionSelect.value, 10);
      var v = versionIndex[idx];
      filename = v.version_name.replace(/\s+/g, "-").toLowerCase() + "-compatible-models.json";
    } else {
      var minV = versionIndex[parseInt(rangeMin.value, 10)];
      var maxV = versionIndex[parseInt(rangeMax.value, 10)];
      filename = minV.version_name.replace(/\s+/g, "-").toLowerCase() +
        "-to-" +
        maxV.version_name.replace(/\s+/g, "-").toLowerCase() +
        "-compatible-models.json";
    }
    downloadJSON(currentModels, filename);
  }

  function downloadJSON(data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Helpers ---
  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.remove("hidden");
  }

  function clearError() {
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
