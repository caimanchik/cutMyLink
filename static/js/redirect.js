class Redirect {
    constructor() {
        this.redirect = document.querySelector('.redirect')
        this.error = document.querySelector('.error')
        
        this.checkLink()
    }
    
    async checkLink() {
        let r = await fetch(`http://127.0.0.1:8000/api/v1/get?link=${window.location.href}&redirect=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        
        let result = await r.json()

        if (r.status !== 200) {
            this.redirect.classList.add('hidden')
            this.error.innerHTML = result.message

            return
        }
        
        window.location.replace(result.url)
    }
}

let redirect = new Redirect()