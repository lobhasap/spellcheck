var submissionLst = (sessionStorage.getItem("submissionLst") || '').split(",").filter(Boolean)
var typos = document.querySelector("#typos")
var level = sessionStorage.getItem('level')
var correctSpellingLst = (sessionStorage.getItem("correctSpellingLst") || '').split(",").filter(Boolean)
var summary = document.querySelector("#summary")
var numCorrect = sessionStorage.getItem("numCorrect")

innerStr = ''

for (var i = 0; i<submissionLst.length; i++){
    var rowIndex = submissionLst.length - i - 1;
    var answer = submissionLst[rowIndex] || '';
    var wasCorrect = answer && !answer.includes('class="error"');
    innerStr += `
    <tr>
        <td>${rowIndex + 1}</td>
        ${correctSpellingLst[rowIndex] || "<td></td>"}
        ${answer || "<td></td>"}
        <td class="result-status ${wasCorrect ? "is-correct" : "is-incorrect"}"><span aria-hidden="true">${wasCorrect ? "✓" : "✗"}</span> ${wasCorrect ? "Correct" : "Incorrect"}</td>
    </tr>
    `
}

typos.innerHTML = innerStr;
summary.innerText = `You spelled ${numCorrect} ${level} level words correctly.`
