var emojiResults = sessionStorage.getItem('emojiResults') || '';
const numWrong = sessionStorage.getItem("numWrong");
const correctSpellingLst = (sessionStorage.getItem("correctSpellingLst") || '').split(',').filter(Boolean);
const submissionLst = (sessionStorage.getItem("submissionLst") || '').split(',').filter(Boolean);
const puzzleNum = sessionStorage.getItem("puzzleNum");
const results = document.querySelector("#results");
const copyBtn = document.querySelector("#copy-btn")
const copyStatus = document.querySelector("#copy-status")
const typos = document.querySelector("#typos")
emojiResults = emojiResults.replaceAll("🟩", "✅").replaceAll("🟥", "❌");

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Try the compatibility path if clipboard permission/API access fails.
        }
    }

    const copyField = document.createElement("textarea");
    copyField.value = text;
    copyField.setAttribute("readonly", "");
    copyField.style.position = "fixed";
    copyField.style.opacity = "0";
    document.body.appendChild(copyField);
    copyField.focus({ preventScroll: true });
    copyField.select();
    copyField.setSelectionRange(0, text.length);
    let copied = false;
    try {
        copied = document.execCommand("copy");
    } finally {
        copyField.remove();
    }
    return copied;
}

copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const shareText = sessionStorage.getItem('emojiResults') || '';
    const shareableResults = `Spellcheck #${puzzleNum}\n${shareText.replaceAll("\\n", "\n").replaceAll("🟩", "✅").replaceAll("🟥", "❌").replaceAll(" ", "")}`;
    try {
        if (!await copyText(shareableResults)) throw new Error("Clipboard copy was denied");
        copyBtn.setAttribute("aria-label", "Results copied to clipboard");
        if (copyStatus) copyStatus.textContent = "Results copied to clipboard.";
    } catch (error) {
        console.error("Unable to copy results:", error);
        if (copyStatus) copyStatus.textContent = "Could not copy results. Please copy them manually.";
        window.alert("Could not copy results. Please select and copy them manually.");
    }
}) 

numRows = Math.max(correctSpellingLst.length, submissionLst.length);
test = ''
for (var i=0; i<numRows;i++){
    if (i == 0){
        test+=`
        <tr>
            <td colspan=4 style="text-align: center"><b>EASY WORDS</b></td>
        </tr>
        `
    }
    if (i == 5){
        test+=`
        <tr>
            <td colspan=4 style="text-align: center"><b>MEDIUM WORDS</b></td>
        </tr>
        `
    }
    if (i == 10){
        test+=`
        <tr>
            <td colspan=4 style="text-align: center"><b>HARD WORDS</b></td>
        </tr>
        `
    }
    test += `
    <tr>
        <td>${i+1}</td>
        ${correctSpellingLst[i] || "<td></td>"}
        ${submissionLst[i] || "<td></td>"}
        <td class="result-status ${submissionLst[i] && !submissionLst[i].includes('class=\"error\"') ? "is-correct" : "is-incorrect"}">
            <span aria-hidden="true">${submissionLst[i] && !submissionLst[i].includes('class=\"error\"') ? "✓" : "✗"}</span>
            ${submissionLst[i] && !submissionLst[i].includes('class=\"error\"') ? "Correct" : "Incorrect"}
        </td>
    </tr>
    `
}
typos.innerHTML = test;
results.setAttribute("aria-label", emojiResults.replaceAll("\\n", "; ").replaceAll("✅", "Correct").replaceAll("❌", "Incorrect"));
emojiResults = emojiResults.replaceAll('\\n', '<br>')
results.innerHTML = `${emojiResults}`;
