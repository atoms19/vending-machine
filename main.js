import d from "https://esm.sh/dominity@6.4";

function navbar() {
   return d.nav(
      { class: "nav red" },
      d.div({ class: "nav-logo" }, "vending machine"),
      d.button("set ip", { class: "btn red" }).on("click", () => {
         let ip = prompt("enter vending machine ip");
         if (ip) {
            localStorage.setItem("ip", ip);
            alert("ip set successfully");
         }
         location.reload();
      })
   );
}

function slotButton(number, r) {
   return d.div(
      d
         .div(`slot ${number}`, { class: "btn light" })
         .css({
            padding: "3rem",
            dispaly: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
         })
         .on("click", () => {
            r.routeTo("/get?slot=" + number);
         }),
      { class: "col col-6 center" }
   );
}

function itemsList(r) {
   let slots = d.state([1, 2, 3, 4]);

   return d.div(
      { class: "" },
      d.div({ class: "row" }).forEvery(slots, (slot) => slotButton(slot, r))
   );
}

//home page
function Home(r) {
   return d.div(d.h1("welcome to vending machine!"), d.hr(), itemsList(r));
}



//is performance really worht the effort
function Purchase(r) {
   let slotnum = r.queries.slot;
   if(slotnum>4 || slotnum <=0) return d.div('invalid slot',{class:'text-red'})

   return d.div(
      d.h1(`purchase item at slot ${slotnum}`),
      d.p(
         `your are about to purchase the item in slot ${slotnum} are you sure then click buy `
      ),
      d.div({ class: "center" }, d.button({ class: "btn blue" }, "buy now ").on('click',()=>{
        fetch(`http://${localStorage.getItem('ip')}/dispense?slot=${slotnum}`,{
            method:'GET',
            mode:'no-cors',
            headers: {
               'Access-Control-Allow-Origin': '*'
           }
        })
      .then(res => {
         if(res.status == 200){
        r.routeTo('/success')
         }
         else{
            r.routeTo('/error')
         }

      })
   }
   ))
)
}

function Success(){
    return d.div({class:'center h-full w-full'},
        d.h1('your purchase is successful',{class:'text-green text-center'})
    )
}


function Error(){
   return d.div({class:'center h-full w-full'},
       d.h1('something went wrong',{class:'text-red text-center'})
   )
}


function layout(elem) {
   return d.div(navbar(), d.div({ class: "wrap pack" }, elem));
}



let router = new d.DominityRouter();
router.setRoutes({
   "/": {
      getComponent: Home,
      layout
   },
   "/get": {
      getComponent: Purchase,
      layout
   },
   '/success':{
        getComponent:Success,
        layout
   }
   ,
   '/error':{
        getComponent:Error,
        layout
   }
});
router.start(document.body);
