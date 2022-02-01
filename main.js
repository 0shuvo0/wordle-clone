const grid = document.querySelector('.keypad-grid')
const keypad = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back']
]
const triesGrid = document.querySelector('.tries-grid')
const triesGridEls = []

const fiveLetterWords = [
    'hello',
    'world',
    'apple',
    'grape',
    'babes',
    'candy',
    'dance',
    'eleph',
    'fancy',
    'giant',
    'happy',
    'jelly',
    'kitty',
    'lucky',
    'mango',
    'nasty',
    'panda',
]
let word

const date = new Date()
const month = date.getMonth()
const day = date.getDate()
const month_day = `${month}-${day}`


let data = localStorage.getItem('wordle_data')
if(data){
    data = JSON.parse(data)
    if(data.date == month_day){
        word = data.word
    }else{
        assignNewWord()
    }
}else{
    assignNewWord()
}
function assignNewWord(){
    word = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)]
    localStorage.setItem('wordle_data', JSON.stringify({
        word,
        date: month_day
    }))
}


let tries_count = 0
let col_pos = 0
function handleKey(text){
    if(text === 'enter'){
        if(col_pos !== 5){
            alert('Please enter 5 letter word')
            return
        }
        if(tries_count > 5){
            alert('You have exceeded the maximum number of tries. Please try again tomorrow.')
            return
        }
        const chars = word.split('')
        let error_count = 0
        triesGridEls[tries_count].map((el, i) => {
            if(el.innerText.toLowerCase() === chars[i]){
                el.classList.add('correct')
            }else if(chars.includes(el.innerText.toLowerCase())){
                el.classList.add('wrong_pos')
                error_count++
            }else{
                el.classList.add('incorrect')
                error_count++
            }
        })
        tries_count++
        col_pos = 0
        if(error_count === 0){
            alert('You win!')
        }
        if(tries_count > 5){
            alert('You have exceeded the maximum number of tries. Please try again tomorrow.')
            return
        }
        return
    }

    if(text === 'back'){
        if(col_pos === 0) return
        triesGridEls[tries_count][col_pos - 1].innerHTML = '&nbsp;'
        col_pos--
        return
    }

    if(col_pos > 4) return
    const el = triesGridEls[tries_count][col_pos]
    el.innerText = text
    col_pos++
}
window.addEventListener('keydown', e => {
    let key = e.key.toLowerCase()
    if(key === 'backspace') key = 'back'
    const az = 'qwertyuiopasdfghjklzxcvbnm'.split('')
    if(az.includes(key) || key === 'enter' || key === 'back'){
        handleKey(key)
    }
})

keypad.forEach(row => {
    const rowDiv = document.createElement('div')
    rowDiv.classList.add('row')
    row.forEach(key => {
        const keyDiv = document.createElement('div')
        keyDiv.classList.add('key')
        keyDiv.innerHTML = key
        keyDiv.addEventListener('click', () => handleKey(key))
        rowDiv.appendChild(keyDiv)
    })
    grid.appendChild(rowDiv)
})

for(let i = 0; i < 6; i++){
    const els = []
    const rowDiv = document.createElement('div')
    rowDiv.classList.add('row')
    for(let j = 0; j < 5; j++){
        const cellDiv = document.createElement('div')
        cellDiv.classList.add('cell')
        els.push(cellDiv)
        cellDiv.innerHTML = '&nbsp;'
        rowDiv.appendChild(cellDiv)
    }
    triesGridEls.push(els)
    triesGrid.appendChild(rowDiv)
}
