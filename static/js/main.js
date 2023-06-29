class Switcher {
    constructor() {
        this.generate = document.querySelector('.generate')
        this.generateSect = document.querySelector('.main__generate')
        this.check = document.querySelector('.check')
        this.checkSect = document.querySelector('.main__check')
        
        this.generate.addEventListener('click', () => {
            this.check.classList.remove('active')
            this.checkSect.classList.remove('active')
            this.generate.classList.add('active')
            this.generateSect.classList.add('active')
        })
        
        this.check.addEventListener('click', () => {
            this.generate.classList.remove('active')
            this.generateSect.classList.remove('active')
            this.check.classList.add('active')
            this.checkSect.classList.add('active')
        })
    }
}

let switcher = new Switcher()

class GenerateForm {
    constructor() {
        this.form = document.getElementById('generate')
        this.url = document.querySelector('.form__url')
        this.days = document.getElementById('days')
        this.hours = document.getElementById('hours')
        this.minutes = document.getElementById('minutes')
        this.submit = document.querySelector('.generate-form__button')
        this.loader = document.querySelector('.generate-loader')
        this.genRes = document.querySelector('.generate-result')
        this.genOrig = document.querySelector('.generate-result-orig')
        this.genLink = document.querySelector('.generate-result__link')
        this.live = document.querySelector('.generate-result-live')
        this.copy = document.querySelector('.generate-result__copy')
        this.genNew = document.getElementById('new-generate')
        
        this.activateForm()
        this.makeControlsLogic()
    }
    
    activateForm() {
        this.resetForm()
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            let { elements } = this.form
            let result = {}

            Array.from(elements)
                .filter(el => !!el.name)
                .forEach(el => {
                    let { name, value } = el
                    result[name] = value
                })

            if (!this.isValid(result))
                return

            let data = {
                url: result.url,
                expires_data: {
                    days: result.days,
                    hours: result.hours,
                    minutes: result.minutes,
                }
            }

            this.getResponse(data)
        })
    }
    
    resetForm() {
        this.url.value = ''
        this.days.value = '1'
        this.hours.value = '0'
        this.minutes.value = '0'
        this.days.classList.remove('wrong')
        this.hours.classList.remove('wrong')
        this.minutes.classList.remove('wrong')
    }
    
    async getResponse(data) {
        let r = await fetch('api/v1/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        
        this.form.classList.remove('active')
        this.loader.classList.add('active')
        
        let result = await r.json()
        
        this.insertResult(result)
        
        this.loader.classList.remove('active')
        this.genRes.classList.add('active')
        
    }
    
    insertResult(result) {
        this.genOrig.innerHTML = result.url
        this.genLink.innerHTML = result.short_url

        let date = new Date(Date.parse(result.expires_at))
        this.live.innerHTML = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}.${date.getMonth() > 9 ? '' : '0'}${date.getMonth()}.${date.getFullYear()} ${date.getHours() > 9 ? '' : '0'}${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`
    }
    
    isValid(fields) {
        let flag = true
        
        if (fields.url === '' || !(/^(ftp|http|https):\/\/[^ "]+$/.test(fields.url))) {
            this.url.classList.add('wrong')
            flag = false
        }
        
        if (!this.isValidNumberField(fields.days) || fields.days === '') {
            this.days.classList.add('wrong')
            flag = false
        }
        
        if (!this.isValidNumberField(fields.hours) || fields.hours === '') {
            this.hours.classList.add('wrong')
            flag = false
        }
        
        if (!this.isValidNumberField(fields.minutes) || fields.minutes === '') {
            this.minutes.classList.add('wrong')
            flag = false
        }
        
        if (fields.days === '0' && fields.hours === '0' && fields.minutes === '0') {
            this.days.classList.add('wrong')
            this.hours.classList.add('wrong')
            this.minutes.classList.add('wrong')
            flag = false
        }
        
        return flag
    }
    
    isValidNumberField(field) {
        
        for (let i = 0; i < field.length; ++i)
            if (field[i].toLowerCase() !== field[i].toUpperCase())
                return false
        
        return true
    }
    
    makeControlsLogic() {
        this.url.addEventListener('click', () => {
            this.url.classList.remove('wrong')
        })
        
        this.days.addEventListener('click', () => {
            this.days.classList.remove('wrong')
            this.hours.classList.remove('wrong')
            this.minutes.classList.remove('wrong')
        })
        
        this.hours.addEventListener('click', () => {
            this.days.classList.remove('wrong')
            this.hours.classList.remove('wrong')
            this.minutes.classList.remove('wrong')
        })
        
        this.minutes.addEventListener('click', () => {
            this.days.classList.remove('wrong')
            this.hours.classList.remove('wrong')
            this.minutes.classList.remove('wrong')
        })
        
        this.copy.addEventListener('click', () => {
            navigator.clipboard.writeText(this.genLink.innerHTML)
        })
        
        this.genNew.addEventListener('click', () => {
            this.genRes.classList.remove('active')
            this.form.classList.add('active')
            this.resetForm()
        })
    }
}

let generate = new GenerateForm()

class CheckForm {
    constructor() {
        this.form = document.getElementById('check-form')
        this.url = document.querySelector('.check-url')
        this.submit = document.getElementById('check-submit')
        
        this.loader = document.querySelector('.check-loader')
        this.checkRes = document.querySelector('.check-result')
        this.checkOrig = document.querySelector('.check-result-orig')
        this.checkLink = document.querySelector('.check-result__link')
        this.live = document.querySelector('.check-result-live')
        this.hops = document.querySelector('.check-result-hops')
        this.copy = document.querySelector('.check-result__copy')
        this.checkNew = document.getElementById('new-check')
        this.error = document.querySelector('.error')
        
        this.activateForm()
        this.makeControlsLogic()
    }
    
    resetForm() {
        this.url.value = ''
    }
    
    activateForm() {
        this.resetForm()

        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            let { elements } = this.form
            let result = {}

            Array.from(elements)
                .filter(el => !!el.name)
                .forEach(el => {
                    let { name, value } = el
                    result[name] = value
                })
            
            result = result.url

            if (!this.isValid(result))
                return

            this.form.classList.remove('active')

            this.getResponse(result)
        })
    }
    
    insertResult(result) {
        this.checkOrig.innerHTML = result.url
        this.checkLink.innerHTML = result.short_url
        let date = new Date(Date.parse(result.expires_at))
        this.live.innerHTML = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}.${date.getMonth() > 9 ? '' : '0'}${date.getMonth()}.${date.getFullYear()} ${date.getHours() > 9 ? '' : '0'}${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`
        this.hops.innerHTML = result.hop_count
    }
    
    isValid(url) {
        if (url === '' || !(/^(ftp|http|https):\/\/[^ "]+$/.test(url))) {
            this.url.classList.add('wrong')
            return false
        }
        
        return true
    }
    
    async getResponse(url) {
        let r = await fetch(`api/v1/get?link=${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        this.form.classList.remove('active')
        this.loader.classList.add('active')

        let result = await r.json()
        
        if (r.status !== 200) {
            this.loader.classList.remove('active')
            this.form.classList.add('active')
            this.error.innerHTML = result.message
            
            return 
        }
        

        this.insertResult(result)

        this.loader.classList.remove('active')
        this.checkRes.classList.add('active')
    }
    
    makeControlsLogic() {
        this.url.addEventListener('click', () => {
            this.url.classList.remove('wrong')
            this.error.innerHTML = ''
        })

        this.copy.addEventListener('click', () => {
            navigator.clipboard.writeText(this.checkLink.innerHTML)
        })

        this.checkNew.addEventListener('click', () => {
            this.checkRes.classList.remove('active')
            this.form.classList.add('active')
            this.resetForm()
        })
    }
}

let chckForm = new CheckForm()