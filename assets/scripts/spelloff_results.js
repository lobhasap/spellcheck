var submissionLst = (sessionStorage.getItem("submissionLst") || '').split(",").filter(Boolean)
var typos = document.querySelector("#typos")
var numCorrect = sessionStorage.getItem('numCorrect')
var correctSpellingLst = (sessionStorage.getItem("correctSpellingLst") || '').split(",").filter(Boolean)
var summary = document.querySelector("#summary")

innerStr = ''

for (var i = 0; i<submissionLst.length; i++){
    var wasCorrect = submissionLst[i] && !submissionLst[i].includes('class="error"');
    innerStr += `
    <tr>
        <td>${i+1}</td>
        ${correctSpellingLst[i] || "<td></td>"}
        ${submissionLst[i] || "<td></td>"}
        <td class="result-status ${wasCorrect ? "is-correct" : "is-incorrect"}"><span aria-hidden="true">${wasCorrect ? "✓" : "✗"}</span> ${wasCorrect ? "Correct" : "Incorrect"}</td>
    </tr>
    `
}

typos.innerHTML = innerStr;
summary.innerText = `You spelled ${numCorrect} words correctly.`
