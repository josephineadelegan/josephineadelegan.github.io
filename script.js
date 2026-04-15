const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const bookingForm = document.getElementById("booking-form");
const confirmationPanel = document.getElementById("confirmation-panel");
const previewButton = document.getElementById("preview-button");
const submitButton = document.getElementById("submit-button");
const submissionPanel = document.getElementById("submission-panel");
const submissionMessage = document.getElementById("submission-message");
const installAppButton = document.getElementById("install-app-button");
const studioEmail = "alafiabraidingsalon@gmail.com";
const instagramUrl = "https://www.instagram.com/alafiabraidingsalon/";
let deferredInstallPrompt = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Keep the app usable even if offline support registration fails.
    });
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installAppButton?.classList.remove("is-hidden");
});

installAppButton?.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installAppButton.classList.add("is-hidden");
});

function setSubmissionState(type, message) {
  if (!submissionPanel || !submissionMessage) {
    return;
  }

  submissionPanel.classList.remove("is-success", "is-error");
  if (type) {
    submissionPanel.classList.add(type === "success" ? "is-success" : "is-error");
  }
  submissionMessage.textContent = message;
}

function collectRequest(form) {
  const formData = new FormData(form);

  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    service: String(formData.get("service") || "").trim(),
    date: String(formData.get("date") || "").trim(),
    time: String(formData.get("time") || "").trim(),
    notes: String(formData.get("notes") || "").trim(),
  };
}

function buildMailtoUrl(request, formattedDate) {
  const subject = `Appointment request: ${request.service} for ${request.name}`;
  const body = [
    `Hello Alafia Braiding Studio,`,
    ``,
    `I would like to request an appointment.`,
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Phone: ${request.phone}`,
    `Service: ${request.service}`,
    `Preferred date/time: ${formattedDate} at ${request.time}`,
    `Style notes: ${request.notes || "No additional notes provided."}`,
  ].join("\n");

  return `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function renderConfirmation(panel, request) {
  const { name, email, phone, service, date, time, notes } = request;
  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date pending";

  panel.replaceChildren();

  const label = document.createElement("p");
  label.className = "card-label";
  label.textContent = "Request summary";

  const result = document.createElement("div");
  result.className = "confirmation-result";

  const lines = [
    `${name} requested ${service}.`,
    `Preferred time: ${formattedDate} at ${time}`,
    `Contact: ${email} · ${phone}`,
    `Style notes: ${notes || "No additional notes provided."}`,
    "Your request is ready to send to the studio for confirmation.",
  ];

  lines.forEach((line, index) => {
    const paragraph = document.createElement("p");

    if (index === 0) {
      const nameStrong = document.createElement("strong");
      nameStrong.textContent = name;
      const serviceStrong = document.createElement("strong");
      serviceStrong.textContent = service;
      paragraph.append(nameStrong, " requested ", serviceStrong, ".");
    } else if (index === 1) {
      const strong = document.createElement("strong");
      strong.textContent = "Preferred time:";
      paragraph.append(strong, ` ${formattedDate} at ${time}`);
    } else if (index === 2) {
      const strong = document.createElement("strong");
      strong.textContent = "Contact:";
      paragraph.append(strong, ` ${email} · ${phone}`);
    } else if (index === 3) {
      const strong = document.createElement("strong");
      strong.textContent = "Style notes:";
      paragraph.append(strong, ` ${notes || "No additional notes provided."}`);
    } else {
      paragraph.textContent = line;
    }

    result.append(paragraph);
  });

  const actions = document.createElement("div");
  actions.className = "confirmation-actions";

  const emailLink = document.createElement("a");
  emailLink.className = "button button-primary";
  emailLink.href = buildMailtoUrl(request, formattedDate);
  emailLink.textContent = "Email this request";

  const instagramLink = document.createElement("a");
  instagramLink.className = "button button-secondary";
  instagramLink.href = instagramUrl;
  instagramLink.target = "_blank";
  instagramLink.rel = "noreferrer";
  instagramLink.textContent = "Message on Instagram";

  const clearButton = document.createElement("button");
  clearButton.className = "button button-secondary";
  clearButton.type = "button";
  clearButton.textContent = "Clear form";
  clearButton.addEventListener("click", () => {
    bookingForm?.reset();
    window.localStorage.removeItem("alafia-booking-request");
    setSubmissionState(null, "Use Preview to review your request, then Submit booking request to send it to the salon inbox.");
    panel.replaceChildren();

    const resetLabel = document.createElement("p");
    resetLabel.className = "card-label";
    resetLabel.textContent = "Request summary";

    const resetText = document.createElement("p");
    resetText.className = "confirmation-placeholder";
    resetText.textContent = "Your appointment summary will appear here after you submit the form.";

    panel.append(resetLabel, resetText);
  });

  actions.append(emailLink, instagramLink, clearButton);

  panel.append(label, result, actions);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (bookingForm && confirmationPanel) {
  const dateField = bookingForm.elements.namedItem("date");

  if (dateField instanceof HTMLInputElement) {
    const today = new Date().toISOString().split("T")[0];
    dateField.min = today;
  }

  previewButton?.addEventListener("click", () => {
    if (!bookingForm.reportValidity()) {
      return;
    }

    const request = collectRequest(bookingForm);
    renderConfirmation(confirmationPanel, request);
    window.localStorage.setItem(
      "alafia-booking-request",
      JSON.stringify(request)
    );
    setSubmissionState(null, "Preview ready. If everything looks good, click Submit booking request to send it to the salon inbox.");
    confirmationPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
      return;
    }

    const request = collectRequest(bookingForm);
    renderConfirmation(confirmationPanel, request);
    setSubmissionState(null, "Sending your request to the salon inbox...");
    submitButton?.setAttribute("disabled", "disabled");

    try {
      const response = await fetch(bookingForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(bookingForm),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      window.localStorage.setItem(
        "alafia-booking-request",
        JSON.stringify(request)
      );
      setSubmissionState(
        "success",
        "Booking request sent. Check the confirmation panel for your summary, and follow up by email or Instagram if needed."
      );
    } catch {
      setSubmissionState(
        "error",
        "The live submission could not be completed from this browser session. You can still use the email or Instagram actions in the request summary."
      );
    } finally {
      submitButton?.removeAttribute("disabled");
      confirmationPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  const savedRequest = window.localStorage.getItem("alafia-booking-request");

  if (savedRequest) {
    try {
      const request = JSON.parse(savedRequest);
      Object.entries(request).forEach(([key, value]) => {
        const field = bookingForm.elements.namedItem(key);
        if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
          field.value = value;
        }
      });
      renderConfirmation(confirmationPanel, request);
      setSubmissionState(null, "Your last saved request has been restored. Review it and submit when you're ready.");
    } catch {
      window.localStorage.removeItem("alafia-booking-request");
    }
  }
}
