// Functions ------------------------------------------------------------------------

/**
 * Save the setting in chrome storage
 * @param {string} key
 * @param {string} value
 */
function saveSetting(key, value) {
  var obj = { saved: "true" };
  obj[key] = value;
  chrome.storage.local.set(obj);
}

/**
 * Take the values of the 'website' inputs and store them as a string
 */
function saveWebsites() {
  var matchesStr = "";
  if ($(".website").length) {
    matchesStr = $(".website")
      .map((index, website) => website.value)
      .get()
      .join("\n");
  }
  chrome.storage.local.set({ saved: "true", matches: matchesStr });
}
/**
 * Retrieve the settings from chrome storage and set the HTML values accordingly
 * @param {function} callback
 */
function retrieveSettings(callback) {
  chrome.storage.local.get(null, function (result) {
    $('#settings-page input:not([type="checkbox"])').each((index, element) => {
      $(element).val(result[$(element).prop("id")]);
    });
    $('#settings-page input[type="checkbox"]').each((index, element) =>
      $(element).prop("checked", result[$(element).prop("id")])
    );
    if (result.matches) {
      result.matches.split("\n").forEach(function (website) {
        $("#add-bar").val(website);
        $("#add-button").trigger("click");
      });
    }
    callback();
  });
}

/**
 * Disable certain input fields depending on other input values
 */
function disable() {
  // Disable certain settings according to checkbox value
  $(".revisits-disableable")
    .toggleClass("disabled", !$("#revisits-checkbox").prop("checked"))
    .prop("disabled", !$("#revisits-checkbox").prop("checked"));
  $(".allday-disableable")
    .toggleClass("disabled", $("#allday-checkbox").prop("checked"))
    .prop("disabled", $("#allday-checkbox").prop("checked"));
}

/**
 * Delete all stored values from chrome storage and tell background to reset to default settings
 */
function clearStorage() {
  chrome.storage.local.clear(() => {
    chrome.runtime.sendMessage({ reset: true }, (response) => window.close());
  });
}

/**
 * Show an error message popup
 * @param {string} message
 */
function errorNotification(message) {
  $("#error-message").text(message);
  $("#error-box").show();
}

// Document ready ------------------------------------------------------------------------

$(document).ready(function () {

  $('#settings-page input[type="checkbox"]').on("change", function () {
    saveSetting($(this).prop("id"), $(this).prop("checked"));
  });

  $('#settings-page input[type="number"]').on("change", function () {
    if ($(this).val() > 0) {
      saveSetting($(this).prop("id"), $(this).val());
      $(this).css("background-color", "white");
    } else {
      switch ($(this).prop("id")) {
        case "seconds":
          errorNotification("Seconds must be greater than zero");
          $(this).css("background-color", "pink");
          break;
        case "revisits-number":
          errorNotification("Minutes must be greater than zero");
          $(this).css("background-color", "pink");
          break;
      }
    }
  });

  $("#settings-page input[type='time']").on("blur", function () {
    var startTime = $("#start-time").val();
    var endTime = $("#end-time").val();
    switch ($(this).prop("id")) {
      case "start-time":
      case "end-time":
        var error =
          (startTime.substring(0, 2) > endTime.substring(0, 2)) |
          ((startTime.substring(0, 2) == endTime.substring(0, 2)) &
            (startTime.substring(3, 5) > endTime.substring(3, 5)));
        if (error) {
          $("#start-time").css("background-color", "pink");
          $("#end-time").css("background-color", "pink");
          errorNotification("Start time must be earlier than end time");
        } else {
          saveSetting($(this).prop("id"), $(this).val());
          $("#start-time").css("background-color", "white");
          $("#end-time").css("background-color", "white");
        }
        break;
    }
  });

  $("#add-button").on("click", function () {
    if ($("#add-bar").val() == "--clear") {
      clearStorage();
    } else if ($("#add-bar").val()) {
      // Create elements
      var websiteRow = document.createElement("div");
      var website = document.createElement("input");
      var removeButton = document.createElement("div");
      // Set properties
      websiteRow.classList.add("website-row");
      website.classList.add("website");
      removeButton.classList.add("button", "remove-button");
      removeButton.innerText = "Remove";
      website.type = "text";
      website.value = $("#add-bar").val();
      // DOM manipulation
      websiteRow.appendChild(website);
      websiteRow.appendChild(removeButton);
      $(websiteRow).appendTo("#website-table");
      // Add listeners
      $(removeButton).on("click", function () {
        $(this).closest(".website-row").remove();
        saveWebsites();
      });
      $(website)
        .focus(function () {
          $(this).select();
        })
        .keyup(function (e) {
          if (e.keyCode == 13) {
            $(this).blur();
          }
        })
        .on("change", saveWebsites);
      // Reset to blank and save
      $("#add-bar").val("");
      saveWebsites();
    }
  });

  $("#add-bar")
    .focus()
    .keyup(function (e) {
      if (e.keyCode == 13) {
        $("#add-button").trigger("click");
      }
    });

  $("#help-link,#back-button").on("click", function (e) {
    e.preventDefault();
    $("#tab-row, #websites-page, #help-page").toggle();
  });

  $("#error-button").on("click", function () {
    $("#error-box").hide();
  });

  $(".tab").on("click", function (e) {
    e.preventDefault();
    if (!$(this).hasClass("activetab")) {
      $(".tab").toggleClass("activetab");
      $("#settings-page,#websites-page").toggle();
    }
  });

  $("#revisits-checkbox").on("change", function () {
    $("#revisits-span").toggleClass("disabled", !$(this).prop("checked"));
    $("#revisits-number").toggleClass("disabled", !$(this).prop("checked"));
    $("#revisits-number").prop("disabled", !$(this).prop("checked"));
  });

  $("#allday-checkbox").on("change", function () {
    $(".allday-disableable")
      .toggleClass("disabled", $("#allday-checkbox").prop("checked"))
      .prop("disabled", $("#allday-checkbox").prop("checked"));
  });

  // Get settings and finish
  retrieveSettings(disable);
});
