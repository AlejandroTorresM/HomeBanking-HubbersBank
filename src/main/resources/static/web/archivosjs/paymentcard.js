const { createApp } = Vue;
createApp({
  data() {
    return {
      client: [],
      clientCards: [],
      activeAccounts: [],
      loanTypes: [],
      loanAutomotriz: [],
      loanHipotecario: [],
      loanPersonal: [],
      cardsActive: [],
      payCardNumber: "",
      payCardHolder: "",
      payDateTrhu: "",
      payCvvNumber: "",
      payDescriptions: "",
      payAccountNumber: "",
      payAmount: "",
    };
  },
  created() {
    this.cuentaCliente();
    this.loadLoans();
  },
  mounted() {},
  methods: {
    cuentaCliente() {
      axios.get("/api/clients/current").then((e) => {
        this.client = e.data;
        this.clientAccount = e.data.accounts;
        this.activeAccounts = this.clientAccount
          .filter((account) => account.accountActive)
          .sort((a, b) => b.id - a.id);
        this.clientLoans = e.data.loans;
        this.clientCards = e.data.cards;
        this.cardsActive = this.clientCards.filter((ca) => ca.cardActive);
      });
    },
    loadLoans() {
      axios.get("/api/loans").then((e) => {
        this.loanTypes = e.data;
        this.loanAutomotriz = this.loanTypes.filter(
          (loan) => loan.nameLoan == "Automotriz"
        );
        this.loanHipotecario = this.loanTypes.filter(
          (loan) => loan.nameLoan == "Hipotecario"
        );
        this.loanPersonal = this.loanTypes.filter(
          (loan) => loan.nameLoan == "Personal"
        );
        console.log(this.loanAutomotriz);
      });
    },
    createLoan() {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, ask for it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post("/api/loans", {
              amount: this.newAmount,
              nameLoan: this.loanNameChoose,
              payment: this.newPaymentLoan,
              numbAccount: this.accDestiny,
            })
            .then(() =>
              Swal.fire("Your loan has been requested", "", "success")
            )
            .then(() => window.location.reload())
            .catch((error) => Swal.fire(error.response.data));
        }
      });
    },
    makePayment() {
      Swal.fire({
        title: 'Are you sure?',
        showCancelButton: true,
        confirmButtonText: 'Payment',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          axios.post('/api/transactions/payment', {cardNumber:this.payCardNumber,cardCVV:this.payCvvNumber,amount:this.payAmount,thruDate:this.payDateTrhu,cardHolder:this.payCardHolder,accountNumber:this.payAccountNumber,description:this.payDescriptions})
          .then(() => Swal.fire("Successful payment","","success"))
          .then(()=>window.location.href="./dashboard2.html")
          .catch(error => Swal.fire(`${error.response.data}`))
        }
      })
    },
    logout() {
      axios
        .post("/api/logout")
        .then(() => (window.location.href = "/web/index.html"));
    },
    formateDate(e) {
      e.forEach((e) => {
        e.fromDate = e.fromDate.slice(2, 7);
      });
    },
  },
  computed: {},
  update: {},
}).mount("#app");

/* Scripts for css grid dashboard */

$(document).ready(() => {
  addResizeListeners();
  setSidenavListeners();
  setUserDropdownListener();
  renderChart();
  setMenuClickListener();
  setSidenavCloseListener();
});

// Set constants and grab needed elements
const sidenavEl = $(".sidenav");
const gridEl = $(".grid");
const SIDENAV_ACTIVE_CLASS = "sidenav--active";
const GRID_NO_SCROLL_CLASS = "grid--noscroll";

function toggleClass(el, className) {
  if (el.hasClass(className)) {
    el.removeClass(className);
  } else {
    el.addClass(className);
  }
}

// User avatar dropdown functionality
function setUserDropdownListener() {
  const userAvatar = $(".header__avatar");

  userAvatar.on("click", function (e) {
    const dropdown = $(this).children(".dropdown");
    toggleClass(dropdown, "dropdown--active");
  });
}

// Sidenav list sliding functionality
function setSidenavListeners() {
  const subHeadings = $(".navList__subheading");
  console.log("subHeadings: ", subHeadings);
  const SUBHEADING_OPEN_CLASS = "navList__subheading--open";
  const SUBLIST_HIDDEN_CLASS = "subList--hidden";

  subHeadings.each((i, subHeadingEl) => {
    $(subHeadingEl).on("click", (e) => {
      const subListEl = $(subHeadingEl).siblings();

      // Add/remove selected styles to list category heading
      if (subHeadingEl) {
        toggleClass($(subHeadingEl), SUBHEADING_OPEN_CLASS);
      }

      // Reveal/hide the sublist
      if (subListEl && subListEl.length === 1) {
        toggleClass($(subListEl), SUBLIST_HIDDEN_CLASS);
      }
    });
  });
}

function renderChart() {
  const chart = AmCharts.makeChart("chartdiv", {
    type: "serial",
    theme: "light",
    dataProvider: [
      {
        month: "Jan",
        visits: 2025,
      },
      {
        month: "Feb",
        visits: 1882,
      },
      {
        month: "Mar",
        visits: 1809,
      },
      {
        month: "Apr",
        visits: 1322,
      },
      {
        month: "May",
        visits: 1122,
      },
      {
        month: "Jun",
        visits: 1114,
      },
      {
        month: "Jul",
        visits: 984,
      },
      {
        month: "Aug",
        visits: 711,
      },
      {
        month: "Sept",
        visits: 665,
      },
      {
        month: "Oct",
        visits: 580,
      },
    ],
    valueAxes: [
      {
        gridColor: "#FFFFFF",
        gridAlpha: 0.2,
        dashLength: 0,
      },
    ],
    gridAboveGraphs: true,
    startDuration: 1,
    graphs: [
      {
        balloonText: "[[category]]: <b>[[value]]</b>",
        fillAlphas: 0.8,
        lineAlpha: 0.2,
        type: "column",
        valueField: "visits",
      },
    ],
    chartCursor: {
      categoryBalloonEnabled: false,
      cursorAlpha: 0,
      zoomable: false,
    },
    categoryField: "month",
    categoryAxis: {
      gridPosition: "start",
      gridAlpha: 0,
      tickPosition: "start",
      tickLength: 20,
    },
    export: {
      enabled: false,
    },
  });
}

function toggleClass(el, className) {
  if (el.hasClass(className)) {
    el.removeClass(className);
  } else {
    el.addClass(className);
  }
}

// If user opens the menu and then expands the viewport from mobile size without closing the menu,
// make sure scrolling is enabled again and that sidenav active class is removed
function addResizeListeners() {
  $(window).resize(function (e) {
    const width = window.innerWidth;

    if (width > 750) {
      sidenavEl.removeClass(SIDENAV_ACTIVE_CLASS);
      gridEl.removeClass(GRID_NO_SCROLL_CLASS);
    }
  });
}

// Menu open sidenav icon, shown only on mobile
function setMenuClickListener() {
  $(".header__menu").on("click", function (e) {
    console.log("clicked menu icon");
    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);
    toggleClass(gridEl, GRID_NO_SCROLL_CLASS);
  });
}

// Sidenav close icon
function setSidenavCloseListener() {
  $(".sidenav__brand-close").on("click", function (e) {
    toggleClass(sidenavEl, SIDENAV_ACTIVE_CLASS);
    toggleClass(gridEl, GRID_NO_SCROLL_CLASS);
  });
}

//Payment Method//
const tarjeta = document.querySelector('#tarjeta'),
	  btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
	  formulario = document.querySelector('#formulario-tarjeta'),
	  numeroTarjeta = document.querySelector('#tarjeta .numero'),
	  nombreTarjeta = document.querySelector('#tarjeta .nombre'),
	  logoMarca = document.querySelector('#logo-marca'),
	  firma = document.querySelector('#tarjeta .firma p'),
	  mesExpiracion = document.querySelector('#tarjeta .mes'),
	  yearExpiracion = document.querySelector('#tarjeta .year');
	  ccv = document.querySelector('#tarjeta .ccv');

// * Volteamos la tarjeta para mostrar el frente.
const mostrarFrente = () => {
	if(tarjeta.classList.contains('active')){
		tarjeta.classList.remove('active');
	}
}

// * Rotacion de la tarjeta
tarjeta.addEventListener('click', () => {
	tarjeta.classList.toggle('active');
});

// * Boton de abrir formulario
btnAbrirFormulario.addEventListener('click', () => {
	btnAbrirFormulario.classList.toggle('active');
	formulario.classList.toggle('active');
});