// ==UserScript==
// @name        DMP Online Helper
// @namespace   Violentmonkey Scripts
// @match       *://*.dmponline.*/*/edit
// @grant       none
// @version     1.0
// @author      Nami Sunami
// @description 9/11/2023, 1:11:00 PM
// ==/UserScript==

// Envelope icon
const biEnvelope = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
</svg>
`;
const biEnvelopeDiv = document.createElement("div");
biEnvelopeDiv.style.display = "flex";
biEnvelopeDiv.style.flexDirection = "row";
biEnvelopeDiv.style.alignItems = "center";
biEnvelopeDiv.innerHTML = biEnvelope;

// Get the panel body under "Write Plan" tab
const panelBody = document.querySelector("#content > div > div");
panelBody.style.display = "none";

const loader = document.createElement("div");
loader.className = "loader";

const loaderContainer = document.createElement("div");
loaderContainer.appendChild(loader);
loaderContainer.style.display = "flex";
loaderContainer.style.justifyContent = "center";
loaderContainer.style.paddingTop = "10rem";
loaderContainer.style.paddingBottom = "10rem";

const panel = document.querySelector("#content > div");
panel.appendChild(loaderContainer);

// Wait for the page to load
window.onload = () => {
  // Expand all automatically
  const expandAll = document.querySelector(
    "#sections-accordion-controls > div > a:nth-child(1)"
  );
  expandAll.click();
  panelBody.style.display = "block";
  // Hide the loader
  loader.style.display = "none";
};

// Get the title of the DMP (from the H1 Tag)
const dmpTitle = document.querySelector(
  "#maincontent > div:nth-child(2) > div > h1"
);

const currentURL = window.location.href;

const dmpIdRe = /(?<=dmponline\.eur\.nl\/plans\/)\d+/gm;
const dmpIdMatch = dmpIdRe.exec(currentURL);
const dmpId = dmpIdMatch[0];

const emailSubject = `DMP Feedback Complete - "${dmpTitle.innerText}" - ${dmpId}`;

const emailTemplate = `I provided feedback to your DMP, "<a href="${currentURL}">${dmpTitle.innerText}</a>". My comments are in the comments tab.`;

// Menu container
const menuContainer = document.createElement("div");
menuContainer.style.display = "flex";
menuContainer.style.flexDirection = "column";
menuContainer.style.backgroundColor = "hsl(0, 0%, 95%)";
menuContainer.style.paddingTop = ".5rem";
menuContainer.style.paddingBottom = ".5rem";
menuContainer.style.paddingLeft = "1rem";
menuContainer.style.paddingRight = ".5rem";
menuContainer.style.borderTopLeftRadius = "1rem";
menuContainer.style.borderBottomLeftRadius = "1rem";
menuContainer.style.zIndex = "999";

// Email actions container
const emailActionsContainer = document.createElement("div");
emailActionsContainer.id = "email-actions-container";
emailActionsContainer.style.display = "flex";
emailActionsContainer.style.flexDirection = "column";
emailActionsContainer.style.justifyContent = "center";
emailActionsContainer.style.paddingTop = "0.5rem";

// Email icon
emailActionsContainer.appendChild(biEnvelopeDiv);

// Email header
const menuHeader = document.createElement("span");
menuHeader.innerText = "Email";
menuHeader.style.paddingLeft = "0.5rem";
biEnvelopeDiv.appendChild(menuHeader);

/// Email Subject Button
const emailSubjectBtn = document.createElement("button");
emailSubjectBtn.innerText = "Subject";
emailSubjectBtn.className = "btn btn-primary";
emailActionsContainer.appendChild(emailSubjectBtn);
emailSubjectBtn.addEventListener("click", () => copyToClip(emailSubject));

// Email Body Button
const emailBodyBtn = document.createElement("button");
emailBodyBtn.innerText = "Body";
emailBodyBtn.className = "btn btn-primary";
emailActionsContainer.appendChild(emailBodyBtn);
emailBodyBtn.addEventListener("click", () => copyToClip(emailTemplate));

// Complete action container
const completeContainer = document.createElement("div");
completeContainer.style.borderTop = "solid 1px";
completeContainer.style.paddingTop = ".5rem";

// Complete feedback button
const completeBtn = document.createElement("button");
completeBtn.innerText = "Complete";
completeBtn.className = "btn btn-primary";
completeBtn.addEventListener("click", () => {
  // Confirm
  let confirmedFeedbackComplete = window.confirm(
    'Do you want to mark this DMP as "feedback complete?"'
  );

  if (confirmedFeedbackComplete) {
    window.location.assign(
      `https://dmponline.eur.nl/org_admin/plans/${dmpId}/feedback_complete`
    );
  }
});
completeContainer.appendChild(completeBtn);

// Construct the menu
menuContainer.appendChild(emailActionsContainer);
menuContainer.appendChild(completeContainer);

menuContainer.style.position = "fixed";
menuContainer.style.right = 0;
menuContainer.style.top = "50%";

document.body.appendChild(menuContainer);

// Copying the rich text to the clipboard
// Thanks to: https://stackoverflow.com/a/50067769/6205282
function copyToClip(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

// Adding loader styles
const styles = `
/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {to{transform: rotate(1turn)}}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
