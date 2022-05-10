//pick meal list from "renderItem" funtion
let mealsState = []

let user = {}
//rutas de login
let ruta = 'login' //login,register,order




const stringtoHTML= (s) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(s,"text/html")
    return doc.body.firstChild
}

//le coloca id a los platos y crea el html de los mismos
const renderItem = (item) => {
    const element = stringtoHTML(`<li data-id="${item._id}">${item.name}</li>`) 
    element.addEventListener("click", ()=> {
    const mealsList = document.getElementById("meals-list")
    Array.from(mealsList.children).forEach(x => x.classList.remove("selected"))
    const mealsidInput = document.getElementById("meals-id")
    mealsidInput.value = item._id

    element.classList.add("selected")
    })
    return element
}

//empareja los id de los platos y junto con el userID crea el html de las ordenes
const renderOrder = (order, meals) => {
    const meal = meals.find(meal => meal._id === order.meal_id)
    const element = stringtoHTML(`<li data-id="${order._id}">${meal.name} - ${order.user_id}</li>`) 
    return element
}

const inicializaFormulario = () => {
    const token = localStorage.getItem("token")
    const orderForm = document.getElementById("order")
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const submit = document.getElementById("submit")
        submit.setAttribute("disabled", true)
        const mealId = document.getElementById("meals-id")
        const mealIdValue = mealId.value
        if ( !mealIdValue) {
            alert("Debes Selecionar un plato")
            submit.removeAttribute("disabled")
        }
        //envia las ordenes al servidor
        const order = {
        meal_id: mealIdValue,
        user_id: user._id,
        }
        fetch("https://almuerziapp-marcosjmatos.vercel.app/api/orders", {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json",
                authorization: token,
                'Access-Control-Allow-Origin': "http://127.0.0.1:5500"
            },
        }).then(x => x.json())
          .then(respuesta => {
            console.log(respuesta)
            const renderedOrder = renderOrder(respuesta, mealsState)
            const ordersList = document.getElementById("orders-list")
            ordersList.appendChild(renderedOrder)
            submit.removeAttribute("disabled")
            .catch(console.log("algo pasó"))
        }
    )}

}

const inicializaDatos = () => {
    fetch("https://almuerziapp-marcosjmatos.vercel.app/api/meals")
    .then(response => response.json())
    .then(data => {
        mealsState = data
        const mealsList = document.getElementById("meals-list")
        const submit = document.getElementById("submit")
        const listItems = data.map(renderItem)
        mealsList.removeChild(mealsList.firstElementChild)
        listItems.forEach(element => mealsList.appendChild(element))
        submit.removeAttribute("disabled")
        fetch("https://almuerziapp-marcosjmatos.vercel.app/api/orders")
            .then(response => response.json())
            .then(ordersDATA => {
                const ordersList = document.getElementById("orders-list")
                const listOrders = ordersDATA.map(orderData => renderOrder(orderData,data))

                ordersList.removeChild(ordersList.firstElementChild)
                listOrders.forEach(element => ordersList.appendChild(element))
            })
        
    })
}

const renderApp = () => {
    const token = localStorage.getItem("token")
    if (token) {
        user = JSON.parse(localStorage.getItem("user"))
        return renderOrders()
    }
    renderLogin()
}

const renderLogin = () => {
    const loginTemplate = document.getElementById("login-template")
    document.getElementById("app").innerHTML = loginTemplate.innerHTML
    const loginForm = document.getElementById("login-form")
    loginForm.onsubmit = (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        fetch("https://almuerziapp-marcosjmatos.vercel.app/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        })
        .then(x => x.json())
        .then(respuesta => {
            localStorage.setItem("token", respuesta.token)
            ruta = 'orders'
            return respuesta.token
        })
        .then(token => {
            return fetch("https://almuerziapp-marcosjmatos.vercel.app/api/auth/me",{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: token,
                },
            })
            .then(x => x.json())
            .then(fetchedUser =>{
                localStorage.setItem("user", (JSON.stringify(fetchedUser)))
                user = fetchedUser
                renderOrders()
            })
    
        })

    }
    
}
const renderOrders = () =>{
    const ordersView = document.getElementById("orders-view")
    document.getElementById("app").innerHTML = ordersView.innerHTML
    inicializaFormulario()
    inicializaDatos()

}

window.onload = () => {
    renderApp()
}
