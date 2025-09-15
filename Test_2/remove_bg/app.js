const fileInput = document.getElementById("file");
const processBtn = document.getElementById("process");
const origImg = document.getElementById("orig");
const resultImg = document.getElementById("result");
const downloadLink = document.getElementById("download");
const transparentChk = document.getElementById("transparent");

let currentFile = null;

// show selected image
fileInput.addEventListener("change", (e) => {
  const f = e.target.files?.[0];
  if (!f) return;

  currentFile = f;
  const url = URL.createObjectURL(f);
  origImg.src = url;
  processBtn.disabled = false;

  // clear old result
  resultImg.removeAttribute("src");
  downloadLink.hidden = true;
});

// call Flask /remove
processBtn.addEventListener("click", async () => {
  if (!currentFile) return;

  processBtn.disabled = true;
  processBtn.textContent = "Processing…";

  try {
    const fd = new FormData();
    fd.append("file", currentFile, currentFile.name);

    const bgMode = transparentChk.checked ? "transparent" : "white";
    const res = await fetch(`/remove?bg=${bgMode}`, {
      method: "POST",
      body: fd,
      cache: "no-store",
    });

    if (!res.ok) {
      alert("Failed to process image.");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    resultImg.src = url;
    downloadLink.href = url;
    downloadLink.hidden = false;
  } catch (err) {
    console.error(err);
    alert("Error during processing.");
  } finally {
    processBtn.disabled = false;
    processBtn.textContent = "Process";
  }
});
