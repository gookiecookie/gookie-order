/* =========================================================
   GOOKIE HQ V1 PRODUCTION
   FILE: hq.js

   SPRINT 1
   - Connect to hqData
   - Connect to verifyPayment
========================================================= */


/* =========================================================
   1. APPS SCRIPT CONFIGURATION
========================================================= */

const GOOKIE_HQ_CONFIG = {
  API_URL:
    "https://script.google.com/macros/s/AKfycbw0cK0xWTgan6YFzLfGta7Mc5qFQkhwzSBO4iwgWGcbXBiNrgAtHKjursf1B_FQPYa39w/exec",

  VERIFIED_BY: "GOOKIE HQ",

  AUTO_REFRESH_MS: 30000,

  OVEN_CAPACITY: 24
};


/* =========================================================
   2. HQ STATE
========================================================= */

const hqState = {
  data: null,
  selectedOrder: null,

  selectedPackingBox: null,
  packingCheckedItems: new Set(),
  isFinishingPacking: false,

  selectedShippingOrder: null,
shippingTrackingLink: "",
isMarkingShipped: false,

  isLoading: false,
  isVerifying: false,
  isStartingBaking: false,

  selectedBakeProductIds: new Set(),

  autoRefreshTimer: null,
  toastTimer: null
};

/*
 * Live countdown timer for Cooling column.
 */
let coolingCountdownTimer = null;
let activeDoughTopUpItem_ = null;


/* =========================================================
   3. DOM REFERENCES
========================================================= */

const connectionStatus =
  document.getElementById("connectionStatus");

const connectionText =
  document.getElementById("connectionText");

const refreshHQButton =
  document.getElementById("refreshHQButton");

const lastUpdatedText =
  document.getElementById("lastUpdatedText");

const openVerifyWhatsAppButton =
  document.getElementById(
    "openVerifyWhatsAppButton");


/* Summary */

const newOrdersCount =
  document.getElementById("newOrdersCount");

const readyToBakeCount =
  document.getElementById("readyToBakeCount");

const productionCount =
  document.getElementById("productionCount");

const readyToShipCount =
  document.getElementById("readyToShipCount");


/* Workflow counts */

const verifyCount =
  document.getElementById("verifyCount");

const bakeQueueCount =
  document.getElementById("bakeQueueCount");

const inOvenCount =
  document.getElementById("inOvenCount");

const coolingCount =
  document.getElementById("coolingCount");

const packingCount =
  document.getElementById("packingCount");

const shippingCount =
  document.getElementById("shippingCount");


/* Workflow lists */

const verifyOrderList =
  document.getElementById("verifyOrderList");

const bakeQueueOrderList =
  document.getElementById("bakeQueueOrderList");

const inOvenOrderList =
  document.getElementById("inOvenOrderList");

const coolingOrderList =
  document.getElementById("coolingOrderList");

const packingOrderList =
  document.getElementById("packingOrderList");

const shippingOrderList =
  document.getElementById("shippingOrderList");

/* Dough Stock Drawer */

const doughStockDrawerButton =
  document.getElementById(
    "doughStockDrawerButton"
  );

const doughStockDrawer =
  document.getElementById(
    "doughStockDrawer"
  );

const closeDoughStockDrawerButton =
  document.getElementById(
    "closeDoughStockDrawerButton"
  );

const doughStockDrawerMount =
  document.getElementById(
    "doughStockDrawerMount"
  );

const doughStockGrid =
  document.getElementById(
    "doughStockGrid"
  );

/* =========================================================
   DOUGH STOCK DRAWER
========================================================= */

function openDoughStockDrawer() {
  if (
    !doughStockDrawer ||
    !doughStockDrawerButton ||
    !pageOverlay
  ) {
    return;
  }

  closeMissionControl();

  doughStockDrawer.classList.add(
    "is-open"
  );

  doughStockDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

  doughStockDrawerButton.setAttribute(
    "aria-expanded",
    "true"
  );

  pageOverlay.hidden = false;

  requestAnimationFrame(function () {
    pageOverlay.classList.add(
      "is-visible"
    );
  });

  document.body.classList.add(
    "drawer-open"
  );
}


function closeDoughStockDrawer() {
  if (
    !doughStockDrawer ||
    !doughStockDrawer.classList.contains(
      "is-open"
    )
  ) {
    return;
  }

  doughStockDrawer.classList.remove(
    "is-open"
  );

  doughStockDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

  doughStockDrawerButton.setAttribute(
    "aria-expanded",
    "false"
  );

  pageOverlay.classList.remove(
    "is-visible"
  );

  setTimeout(function () {
    if (
      !missionControlDrawer.classList.contains(
        "is-open"
      )
    ) {
      pageOverlay.hidden = true;
    }
  }, 240);

  document.body.classList.remove(
    "drawer-open"
  );
}
/* Mission Control */

const missionControlButton =
  document.getElementById("missionControlButton");

const missionControlDrawer =
  document.getElementById("missionControlDrawer");

const closeMissionControlButton =
  document.getElementById("closeMissionControlButton");

const missionControlSearch =
  document.getElementById("missionControlSearch");

const pageOverlay =
  document.getElementById("pageOverlay");


/* Mission Control counts */

const drawerVerifyCount =
  document.getElementById("drawerVerifyCount");

const drawerBakeQueueCount =
  document.getElementById("drawerBakeQueueCount");

const drawerInOvenCount =
  document.getElementById("drawerInOvenCount");

const drawerCoolingCount =
  document.getElementById("drawerCoolingCount");

const drawerPackingCount =
  document.getElementById("drawerPackingCount");

const drawerShippingCount =
  document.getElementById("drawerShippingCount");

const drawerCompletedCount =
  document.getElementById("drawerCompletedCount");


/* Mission Control lists */

const drawerVerifyList =
  document.getElementById("drawerVerifyList");

const drawerBakeQueueList =
  document.getElementById("drawerBakeQueueList");

const drawerInOvenList =
  document.getElementById("drawerInOvenList");

const drawerCoolingList =
  document.getElementById("drawerCoolingList");

const drawerPackingList =
  document.getElementById("drawerPackingList");

const drawerShippingList =
  document.getElementById("drawerShippingList");

const drawerCompletedList =
  document.getElementById("drawerCompletedList");


/* Verify modal */

const verifyPaymentModal =
  document.getElementById("verifyPaymentModal");

const closeVerifyModalButton =
  document.getElementById("closeVerifyModalButton");

const cancelVerifyPaymentButton =
  document.getElementById("cancelVerifyPaymentButton");

const confirmVerifyPaymentButton =
  document.getElementById("confirmVerifyPaymentButton");

const verifyModalOrderID =
  document.getElementById("verifyModalOrderID");

const verifyModalCustomerName =
  document.getElementById("verifyModalCustomerName");

const verifyModalPhone =
  document.getElementById("verifyModalPhone");

const verifyModalTotal =
  document.getElementById("verifyModalTotal");

const verifyModalPaymentStatus =
  document.getElementById("verifyModalPaymentStatus");

const verifyModalItems =
  document.getElementById("verifyModalItems");

const verifyButtonText =
  document.getElementById("verifyButtonText");

const verifyButtonSpinner =
  document.getElementById("verifyButtonSpinner");


/* Order details modal */

const orderDetailsModal =
  document.getElementById("orderDetailsModal");

const orderDetailsModalTitle =
  document.getElementById("orderDetailsModalTitle");

const orderDetailsContent =
  document.getElementById("orderDetailsContent");

const closeOrderDetailsButton =
  document.getElementById("closeOrderDetailsButton");

/* Packing modal */

const packingModal =
  document.getElementById(
    "packingModal"
  );

const packingModalTitle =
  document.getElementById(
    "packingModalTitle"
  );

const packingModalOrderId =
  document.getElementById(
    "packingModalOrderId"
  );

const packingModalBoxId =
  document.getElementById(
    "packingModalBoxId"
  );

const packingModalBoxName =
  document.getElementById(
    "packingModalBoxName"
  );

const packingModalBoxNumber =
  document.getElementById(
    "packingModalBoxNumber"
  );

const packingModalExpectedQty =
  document.getElementById(
    "packingModalExpectedQty"
  );

const packingChecklist =
  document.getElementById(
    "packingChecklist"
  );

const packingProgressCurrent =
  document.getElementById(
    "packingProgressCurrent"
  );

const packingProgressTotal =
  document.getElementById(
    "packingProgressTotal"
  );

const packingProgressBar =
  document.getElementById(
    "packingProgressBar"
  );

const packingProgressFill =
  document.getElementById(
    "packingProgressFill"
  );

const closePackingModalButton =
  document.getElementById(
    "closePackingModalButton"
  );

const cancelPackingButton =
  document.getElementById(
    "cancelPackingButton"
  );

const finishPackingButton =
  document.getElementById(
    "finishPackingButton"
  );

/* Shipping modal */

const shippingModal =
  document.getElementById(
    "shippingModal"
  );

const shippingModalTitle =
  document.getElementById(
    "shippingModalTitle"
  );

const shippingModalOrderId =
  document.getElementById(
    "shippingModalOrderId"
  );

const shippingModalCustomer =
  document.getElementById(
    "shippingModalCustomer"
  );

const shippingModalBoxCount =
  document.getElementById(
    "shippingModalBoxCount"
  );

const shippingModalCookieQty =
  document.getElementById(
    "shippingModalCookieQty"
  );

const shippingModalPostcode =
  document.getElementById(
    "shippingModalPostcode"
  );

const shippingModalAddress =
  document.getElementById(
    "shippingModalAddress"
  );

const shippingCourierSelect =
  document.getElementById(
    "shippingCourierSelect"
  );

const shippingTrackingNumberInput =
  document.getElementById(
    "shippingTrackingNumberInput"
  );

const shippingOpenTrackingLink =
  document.getElementById(
    "shippingOpenTrackingLink"
  );

const shippingTrackingUnavailable =
  document.getElementById(
    "shippingTrackingUnavailable"
  );

const shippingNotificationPreview =
  document.getElementById(
    "shippingNotificationPreview"
  );

const closeShippingModalButton =
  document.getElementById(
    "closeShippingModalButton"
  );

const cancelShippingButton =
  document.getElementById(
    "cancelShippingButton"
  );

const markAsShippedButton =
  document.getElementById(
    "markAsShippedButton"
  );

/* Toast */

const hqToast =
  document.getElementById("hqToast");

const toastIcon =
  document.getElementById("toastIcon");

const toastTitle =
  document.getElementById("toastTitle");

const toastMessage =
  document.getElementById("toastMessage");


/* Loading */

const hqLoadingScreen =
  document.getElementById("hqLoadingScreen");

const loadingMessage =
  document.getElementById("loadingMessage");


/* =========================================================
   4. INITIALISE HQ
========================================================= */

document.addEventListener("DOMContentLoaded", initialiseHQ);


function initialiseHQ() {
  bindHQEvents();
  loadHQData({ showLoadingScreen: true });
  startAutoRefresh();
   
}


/* =========================================================
   5. EVENT LISTENERS
========================================================= */

function bindHQEvents() {

  refreshHQButton.addEventListener("click", function () {
    loadHQData({
      showLoadingScreen: false,
      showSuccessToast: true
    });
  });

doughStockDrawerButton.addEventListener(
  "click",
  openDoughStockDrawer
);

closeDoughStockDrawerButton.addEventListener(
  "click",
  closeDoughStockDrawer
);
   
  missionControlButton.addEventListener(
    "click",
    openMissionControl
  );


  closeMissionControlButton.addEventListener(
    "click",
    closeMissionControl
  );


 pageOverlay.addEventListener("click", function () {
  closeMissionControl();
  closeDoughStockDrawer();
});


  missionControlSearch.addEventListener(
    "input",
    handleMissionControlSearch
  );


  closeVerifyModalButton.addEventListener(
    "click",
    closeVerifyPaymentModal
  );


  cancelVerifyPaymentButton.addEventListener(
    "click",
    closeVerifyPaymentModal
  );


  confirmVerifyPaymentButton.addEventListener(
    "click",
    confirmVerifyPayment
  );


  closeOrderDetailsButton.addEventListener(
    "click",
    closeOrderDetailsModal
  );


  verifyPaymentModal.addEventListener("click", function (event) {
    if (event.target === verifyPaymentModal) {
      closeVerifyPaymentModal();
    }
  });


  orderDetailsModal.addEventListener("click", function (event) {
    if (event.target === orderDetailsModal) {
      closeOrderDetailsModal();
    }
  });


  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

closeMissionControl();
closeDoughStockDrawer();
closeVerifyPaymentModal();
closeOrderDetailsModal();
closePackingModal();
closeShippingModal();
  });

   inOvenOrderList.addEventListener(
  "click",
  function (event) {

    const button =
      event.target.closest(
        ".done-baking-button"
      );

    if (!button) {
      return;
    }

    const batchId =
      button.dataset.batchId;

    if (!batchId) {
      return;
    }

    confirmDoneBaking(batchId);

  }
);

coolingOrderList.addEventListener(
  "click",
  function (event) {
    const button =
      event.target.closest(
        ".ready-to-pack-button"
      );

    if (!button) {
      return;
    }

    const batchId =
      button.dataset.batchId;

    if (!batchId) {
      return;
    }

    confirmReadyToPack(batchId);
  }
);

document
  .getElementById("doughTopUpForm")
  .addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      const quantity =
        Number(
          document.getElementById(
            "doughTopUpQuantity"
          ).value
        );

      if (quantity <= 0) {
        showToast(
          "Invalid quantity",
          "Quantity must be greater than zero.",
          "error"
        );
        return;
      }

      const saveButton =
        document.getElementById(
          "doughTopUpSaveButton"
        );

      saveButton.disabled = true;
      saveButton.textContent =
        "Saving...";

      try {

        const payload = {

          action:
            "topUpDoughStock",

          doughId:
            document.getElementById(
              "doughTopUpDoughId"
            ).value,

          quantity:
            quantity,

          notes:
            document.getElementById(
              "doughTopUpNotes"
            ).value

        };

        const response =
          await fetch(
            GOOKIE_HQ_CONFIG.API_URL,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "text/plain;charset=utf-8"
              },

              body:
                JSON.stringify(payload),

              redirect: "follow"
            }
          );

        if (!response.ok) {
          throw new Error(
            "Top Up request failed. HTTP " +
            response.status
          );
        }

        const result =
          await response.json();

        if (
          !result ||
          result.ok !== true
        ) {
          throw new Error(
            result && result.message
              ? result.message
              : "Unable to update dough stock."
          );
        }

        closeDoughTopUpModal_();

        showToast(
          "Dough Updated",
          result.message,
          "success"
        );

        await loadHQData({
          showLoadingScreen:false
        });

      } catch (error) {

        console.error(
          "GOOKIE HQ Dough Top Up error:",
          error
        );

        showToast(
          "Top Up failed",
          error.message,
          "error"
        );

      } finally {

        saveButton.disabled = false;

        saveButton.textContent =
          "Save Dough Stock";

      }

    }
  );

packingOrderList.addEventListener(
  "click",
  function (event) {
    const button =
      event.target.closest(
        ".open-packing-button"
      );

    if (!button) {
      return;
    }

    const orderBoxId =
      button.dataset.orderBoxId;

    if (!orderBoxId) {
      return;
    }

    openPackingModal(orderBoxId);
  }
);

packingChecklist.addEventListener(
  "change",
  function (event) {
    const checkbox =
      event.target.closest(
        "[data-packing-check-id]"
      );

    if (!checkbox) {
      return;
    }

    const checkId =
      checkbox.dataset.packingCheckId;

    if (checkbox.checked) {
      hqState.packingCheckedItems.add(checkId);
    } else {
      hqState.packingCheckedItems.delete(checkId);
    }

    updatePackingProgress();
  }
);

closePackingModalButton.addEventListener(
  "click",
  closePackingModal
);

cancelPackingButton.addEventListener(
  "click",
  closePackingModal
);

finishPackingButton.addEventListener(
  "click",
  confirmFinishPacking
);

/* Shipping events */

shippingOrderList.addEventListener(
  "click",
  function (event) {
    const button =
      event.target.closest(
        ".open-shipping-button"
      );

    if (!button) {
      return;
    }

    const orderId =
      button.dataset.orderId;

    if (!orderId) {
      return;
    }

    openShippingModal(orderId);
  }
);


shippingCourierSelect.addEventListener(
  "change",
  function () {
    updateShippingTrackingLink();
    updateShippingFormState();
  }
);


shippingTrackingNumberInput.addEventListener(
  "input",
  function () {
    updateShippingTrackingLink();
    updateShippingFormState();
  }
);


closeShippingModalButton.addEventListener(
  "click",
  closeShippingModal
);


cancelShippingButton.addEventListener(
  "click",
  closeShippingModal
);

markAsShippedButton.addEventListener(
  "click",
  confirmMarkAsShipped
);
   
if (!coolingCountdownTimer) {
  coolingCountdownTimer =
    window.setInterval(
      updateCoolingCountdowns,
      1000
    );
}
   
}


/* =========================================================
   6. LOAD HQ DATA
========================================================= */

async function loadHQData(options = {}) {

  if (hqState.isLoading) {
    return;
  }

  const showLoadingScreen =
    options.showLoadingScreen === true;

  const showSuccessToast =
    options.showSuccessToast === true;

  hqState.isLoading = true;

  setConnectionStatus(
    "loading",
    "Connecting..."
  );

  if (showLoadingScreen) {
    showHQLoadingScreen(
      "Connecting to Mission Control..."
    );
  }

  setRefreshButtonLoading(true);

  try {

    const result = await loadHQDataViaJSONP();

    if (!result || result.ok !== true) {
      throw new Error(
        result && result.message
          ? result.message
          : "HQ data could not be loaded."
      );
    }

    hqState.data = normaliseHQData(result);

    renderHQ();

    setConnectionStatus(
      "connected",
      "HQ Connected"
    );

    updateLastUpdated(result.generatedAt);

    if (showSuccessToast) {
      showToast(
        "HQ refreshed",
        "Latest production data loaded.",
        "success"
      );
    }

  } catch (error) {

    console.error(
      "GOOKIE HQ load error:",
      error
    );

    setConnectionStatus(
      "error",
      "Connection Error"
    );

    showHQConnectionError(
      error.message
    );

    showToast(
      "Connection failed",
      error.message,
      "error"
    );

  } finally {

    hqState.isLoading = false;

    setRefreshButtonLoading(false);

    hideHQLoadingScreen();
  }
}

function loadHQDataViaJSONP() {

  return new Promise(function (resolve, reject) {

    const callbackName =
      "gookieHQCallback_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 100000);

    const script =
      document.createElement("script");

    const timeout =
      setTimeout(function () {

        cleanup();

        reject(
          new Error(
            "HQ connection timed out."
          )
        );

      }, 15000);


    function cleanup() {

      clearTimeout(timeout);

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

      try {
        delete window[callbackName];
      } catch (error) {
        window[callbackName] = undefined;
      }
    }


    window[callbackName] =
      function (result) {

        cleanup();

        resolve(result);
      };


    script.onerror =
      function () {

        cleanup();

        reject(
          new Error(
            "Unable to load HQ data."
          )
        );
      };


    script.src =
      GOOKIE_HQ_CONFIG.API_URL +
      "?action=hqData" +
      "&callback=" +
      encodeURIComponent(callbackName) +
      "&timestamp=" +
      Date.now();


    document.body.appendChild(script);
  });
}

/* =========================================================
   7. NORMALISE HQ DATA
========================================================= */

function normaliseHQData(result) {
  return {
    generatedAt:
      result.generatedAt || new Date().toISOString(),

    awaitingVerification:
      Array.isArray(result.awaitingVerification)
        ? result.awaitingVerification
        : [],

    productionQueue:
      Array.isArray(result.productionQueue)
        ? result.productionQueue
        : [],

    activeBatches:
      Array.isArray(result.activeBatches)
        ? result.activeBatches
        : [],

    coolingBatches:
      Array.isArray(result.coolingBatches)
        ? result.coolingBatches
        : [],

    packingQueue:
      Array.isArray(result.packingQueue)
        ? result.packingQueue
        : [],

    shippingQueue:
      Array.isArray(result.shippingQueue)
        ? result.shippingQueue
        : [],

    completedOrders:
      Array.isArray(result.completedOrders)
        ? result.completedOrders
        : [],

    doughStock:
      Array.isArray(result.doughStock)
        ? result.doughStock
        : []
  };
}

/* =========================================================
   8. MAIN RENDER
========================================================= */

function renderHQ() {

  if (!hqState.data) {
    return;
  }

  renderSummary();
  renderVerifyColumn();
  renderBakeQueueColumn();
  renderInOvenColumn();
  renderCoolingColumn();
  renderPackingColumn();
  renderShippingColumn();
  renderMissionControl();
   renderDoughStock();
}


/* =========================================================
   9. SUMMARY
========================================================= */

function renderSummary() {
  const data = hqState.data;

  const bakeQueueQuantity =
    data.productionQueue.reduce(function (total, item) {
      return total + safeNumber(item.qty);
    }, 0);

  const activeBatchQuantity =
    data.activeBatches.reduce(function (total, batch) {
      return total + getItemsQuantity(batch.items);
    }, 0);

  const coolingQuantity =
    data.coolingBatches.reduce(function (total, batch) {
      return total + getItemsQuantity(batch.items);
    }, 0);

  const packingQuantity =
    data.packingQueue.reduce(function (total, box) {
      return total + safeNumber(box.expectedCookieQty);
    }, 0);


  newOrdersCount.textContent =
    String(data.awaitingVerification.length);

  readyToBakeCount.textContent =
    String(bakeQueueQuantity);

  productionCount.textContent =
    String(
      activeBatchQuantity +
      coolingQuantity +
      packingQuantity
    );

  readyToShipCount.textContent =
    String(data.shippingQueue.length);
}


/* =========================================================
   10. VERIFY COLUMN
========================================================= */

function renderVerifyColumn() {
  const orders =
    hqState.data.awaitingVerification;

  verifyCount.textContent =
    String(orders.length);


  if (orders.length === 0) {
    verifyOrderList.innerHTML =
      createEmptyState(
        "No payment to verify."
      );

    return;
  }


  verifyOrderList.innerHTML =
    orders.map(createVerifyOrderCard).join("");


  verifyOrderList
    .querySelectorAll("[data-action='open-verify']")
    .forEach(function (button) {

      button.addEventListener("click", function () {
        const orderId =
          button.dataset.orderId;

        openVerifyPaymentModal(orderId);
      });

    });

  verifyOrderList
    .querySelectorAll("[data-action='view-order']")
    .forEach(function (button) {

      button.addEventListener("click", function () {
        const orderId =
          button.dataset.orderId;

        openOrderDetails(orderId);
      });

    });
}


function createVerifyOrderCard(order) {
  return `
    <article
      class="order-card"
      data-order-id="${escapeHTML(order.orderId)}"
    >

      <div class="order-card-top">

        <button
          class="order-id-button"
          type="button"
          data-action="view-order"
          data-order-id="${escapeHTML(order.orderId)}"
        >
          ${escapeHTML(order.orderId)}
        </button>

        <span class="order-time">
          ${escapeHTML(formatOrderTime(order.timestamp))}
        </span>

      </div>


      <p class="order-customer">
        ${escapeHTML(order.customerName || "Customer")}
      </p>


      <div class="order-items-preview">
        <p>
          ${escapeHTML(createBoxesPreview(order.boxes))}
        </p>
      </div>


      <div class="order-meta-row">

        <strong class="order-total">
          ${formatCurrency(order.grandTotal)}
        </strong>

        <span class="order-status-badge">
          ${escapeHTML(order.paymentStatus || "PENDING")}
        </span>

      </div>


         <div class="order-actions">

        <button
          class="card-primary-button"
          type="button"
          data-action="open-verify"
          data-order-id="${escapeHTML(order.orderId)}"
        >
          Verify Payment
        </button>

      </div>

    </article>
  `;
}


/* =========================================================
   11. BAKE QUEUE COLUMN
========================================================= */

function renderBakeQueueColumn() {
  const queue =
    hqState.data.productionQueue;

  const totalQuantity =
    queue.reduce(function (total, item) {
      return total + safeNumber(item.qty);
    }, 0);

  bakeQueueCount.textContent =
    String(totalQuantity);

  if (queue.length === 0) {
    hqState.selectedBakeProductIds.clear();

    bakeQueueOrderList.innerHTML =
      createEmptyState(
        "No order waiting to bake."
      );

    return;
  }

  /* Remove selections that are no longer in the live queue. */
  const liveProductIds = new Set(
    queue.map(function (item) {
      return item.productId;
    })
  );

  Array.from(hqState.selectedBakeProductIds)
    .forEach(function (productId) {
      if (!liveProductIds.has(productId)) {
        hqState.selectedBakeProductIds.delete(productId);
      }
    });

  const cardsHTML = queue.map(function (item) {
    const productId = String(item.productId || "");
    const isChecked =
      hqState.selectedBakeProductIds.has(productId);

    return `
      <article class="order-card">

        <div class="order-card-top">

          <label
            class="order-id-button"
            style="display:flex;align-items:center;gap:10px;cursor:pointer;"
          >
            <input
              type="checkbox"
              data-action="select-bake-product"
              data-product-id="${escapeHTML(productId)}"
              ${isChecked ? "checked" : ""}
              ${hqState.isStartingBaking ? "disabled" : ""}
            >

            <span>
              ${escapeHTML(
                item.displayName ||
                item.menuCode ||
                item.productId
              )}
            </span>
          </label>

          <span class="order-status-badge is-paid">
            READY
          </span>

        </div>

        <div class="order-items-preview">
          <p>
            Product ID:
            ${escapeHTML(item.productId || "—")}
          </p>
        </div>

        <div class="order-meta-row">

          <strong class="order-total">
            ×${safeNumber(item.qty)}
          </strong>

          <span class="order-time">
            Cookies
          </span>

        </div>

      </article>
    `;
  }).join("");

  const selectedQuantity =
    getSelectedBakeQuantity(queue);

  const isOverCapacity =
    selectedQuantity > GOOKIE_HQ_CONFIG.OVEN_CAPACITY;

  const canStart =
    selectedQuantity > 0 &&
    !isOverCapacity &&
    !hqState.isStartingBaking;

  const actionHTML = `
    <article class="order-card">

      <div class="order-card-top">
        <strong class="order-id-button">
          Selected
        </strong>

        <span class="order-status-badge">
          ${selectedQuantity} / ${GOOKIE_HQ_CONFIG.OVEN_CAPACITY}
        </span>
      </div>

      <div class="order-items-preview">
        <p>
          ${isOverCapacity
            ? "Oven capacity exceeded. Remove one or more flavours."
            : selectedQuantity > 0
              ? selectedQuantity + " cookies selected for this batch."
              : "Select the flavours to place in the oven."
          }
        </p>
      </div>

      <div class="order-actions">
        <button
          class="card-primary-button"
          id="startBakingButton"
          type="button"
          ${canStart ? "" : "disabled"}
        >
          ${hqState.isStartingBaking
            ? "Starting Batch..."
            : "START BAKING"
          }
        </button>
      </div>

    </article>
  `;

  bakeQueueOrderList.innerHTML =
    cardsHTML + actionHTML;

  bakeQueueOrderList
    .querySelectorAll(
      "[data-action='select-bake-product']"
    )
    .forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        const productId = checkbox.dataset.productId;

        if (checkbox.checked) {
          hqState.selectedBakeProductIds.add(productId);
        } else {
          hqState.selectedBakeProductIds.delete(productId);
        }

        renderBakeQueueColumn();
      });
    });

  const startBakingButton =
    document.getElementById("startBakingButton");

  if (startBakingButton) {
    startBakingButton.addEventListener(
      "click",
      confirmStartBaking
    );
  }
}


function getSelectedBakeQuantity(queue) {
  return queue.reduce(function (total, item) {
    return hqState.selectedBakeProductIds.has(
      String(item.productId || "")
    )
      ? total + safeNumber(item.qty)
      : total;
  }, 0);
}


async function confirmStartBaking() {
  if (
    hqState.isStartingBaking ||
    !hqState.data
  ) {
    return;
  }

  const selectedItems =
    hqState.data.productionQueue
      .filter(function (item) {
        return hqState.selectedBakeProductIds.has(
          String(item.productId || "")
        );
      })
      .map(function (item) {
        return {
          productId: item.productId,
          qty: safeNumber(item.qty)
        };
      });

  if (selectedItems.length === 0) {
    showToast(
      "Nothing selected",
      "Select at least one flavour before starting a batch.",
      "error"
    );
    return;
  }

  const selectedQuantity =
    selectedItems.reduce(function (total, item) {
      return total + safeNumber(item.qty);
    }, 0);

  if (
    selectedQuantity >
    GOOKIE_HQ_CONFIG.OVEN_CAPACITY
  ) {
    showToast(
      "Oven capacity exceeded",
      "Maximum capacity is " +
        GOOKIE_HQ_CONFIG.OVEN_CAPACITY +
        " cookies.",
      "error"
    );
    return;
  }

  hqState.isStartingBaking = true;
  renderBakeQueueColumn();

  try {
    const payload = {
      action: "startBaking",
      startedBy: GOOKIE_HQ_CONFIG.VERIFIED_BY,
      items: selectedItems
    };

    const response = await fetch(
      GOOKIE_HQ_CONFIG.API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Start Baking request failed. HTTP " +
        response.status
      );
    }

    const result = await response.json();
     
console.log(result);
     
    if (!result || result.ok !== true) {
      throw new Error(
        result && result.message
          ? result.message
          : "Production batch could not be started."
      );
    }

    hqState.selectedBakeProductIds.clear();

    showToast(
      "Batch started",
      result.batchId + " moved to In Oven.",
      "success"
    );

    await loadHQData({
      showLoadingScreen: false
    });
  } catch (error) {
    console.error(
      "GOOKIE HQ start baking error:",
      error
    );

    showToast(
      "Start Baking failed",
      error.message,
      "error"
    );
  } finally {
    hqState.isStartingBaking = false;
    renderBakeQueueColumn();
  }
}


/* =========================================================
   12. IN OVEN COLUMN
========================================================= */

function renderInOvenColumn() {
  const batches =
    hqState.data.activeBatches;


  inOvenCount.textContent =
    String(batches.length);


  if (batches.length === 0) {
    inOvenOrderList.innerHTML =
      createEmptyState(
        "No active baking batch."
      );

    return;
  }


  inOvenOrderList.innerHTML =
    batches.map(function (batch) {

      return `
        <article class="order-card">

          <div class="order-card-top">

            <strong class="order-id-button">
              ${escapeHTML(batch.batchId)}
            </strong>

            <span class="order-status-badge is-paid">
              ${escapeHTML(batch.status)}
            </span>

          </div>

          <div class="order-items-preview">
            <p>
              ${escapeHTML(
                createItemsPreview(batch.items)
              )}
            </p>
          </div>

          <div class="order-meta-row">

            <strong class="order-total">
              ${getItemsQuantity(batch.items)} pcs
            </strong>

            <span class="order-time">
              ${escapeHTML(
                formatOrderTime(batch.startedAt)
              )}
            </span>

         </div>

<button
  class="secondary-button done-baking-button"
  type="button"
  data-batch-id="${escapeHTML(batch.batchId)}"
>
  DONE BAKING
</button>

</article>
      `;

    }).join("");
}

/* =========================================================
   12A. DONE BAKING
========================================================= */

async function confirmDoneBaking(batchId) {
  const cleanBatchId = String(batchId || "").trim();

  if (!cleanBatchId) {
    return;
  }

  const button = inOvenOrderList.querySelector(
    `.done-baking-button[data-batch-id="${cleanBatchId}"]`
  );

  if (button && button.disabled) {
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "MOVING TO COOLING...";
  }

  try {
    const payload = {
      action: "doneBaking",
      batchId: cleanBatchId,
      completedBy: GOOKIE_HQ_CONFIG.VERIFIED_BY
    };

    const response = await fetch(
      GOOKIE_HQ_CONFIG.API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        redirect: "follow"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Done Baking request failed. HTTP " +
          response.status
      );
    }

    const result = await response.json();

    if (!result || result.ok !== true) {
      throw new Error(
        result && result.message
          ? result.message
          : "Unable to move batch to Cooling."
      );
    }

    showToast(
      "Baking completed",
      cleanBatchId + " moved to Cooling.",
      "success"
    );

    await loadHQData({
      showLoadingScreen: false
    });
  } catch (error) {
    console.error(
      "GOOKIE HQ done baking error:",
      error
    );

    showToast(
      "Done Baking failed",
      error.message ||
        "Unable to move batch to Cooling.",
      "error"
    );

    if (button) {
      button.disabled = false;
      button.textContent = "DONE BAKING";
    }
  }
}

/* =========================================================
   13A. READY TO PACK
========================================================= */

async function confirmReadyToPack(batchId) {

  const cleanBatchId =
    String(batchId || "").trim();

  if (!cleanBatchId) {
    return;
  }

  const button =
    coolingOrderList.querySelector(
      `.ready-to-pack-button[data-batch-id="${cleanBatchId}"]`
    );

  if (button && button.disabled) {
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "MOVING...";
  }

  try {

    const payload = {
      action: "readyToPack",
      batchId: cleanBatchId,
      completedBy:
        GOOKIE_HQ_CONFIG.VERIFIED_BY
    };

    const response =
      await fetch(
        GOOKIE_HQ_CONFIG.API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload),
          redirect: "follow"
        }
      );

    if (!response.ok) {
      throw new Error(
        "Ready To Pack request failed. HTTP " +
        response.status
      );
    }

    const result =
      await response.json();

    if (!result || result.ok !== true) {
      throw new Error(
        result && result.message
          ? result.message
          : "Unable to move batch."
      );
    }

    showToast(
      "Ready to Pack",
      cleanBatchId +
        " moved to Packing Queue.",
      "success"
    );

    await loadHQData({
      showLoadingScreen: false
    });

  } catch (error) {

    console.error(
      "GOOKIE HQ Ready To Pack error:",
      error
    );

    showToast(
      "Ready To Pack failed",
      error.message,
      "error"
    );

    if (button) {
      button.disabled = false;
      button.textContent =
        "READY TO PACK";
    }

  }

}

/* =========================================================
   13. COOLING COLUMN
========================================================= */

function renderCoolingColumn() {
  const batches =
    hqState.data.coolingBatches;

  coolingCount.textContent =
    String(batches.length);

  if (batches.length === 0) {
    coolingOrderList.innerHTML =
      createEmptyState(
        "No cooling batch."
      );

    return;
  }

  coolingOrderList.innerHTML =
    batches.map(function (batch) {
      const coolingState =
        getCoolingCountdownState(
          batch.coolingReadyAt
        );

      return `
        <article
          class="order-card"
          data-cooling-batch-id="${escapeHTML(
            batch.batchId
          )}"
        >

          <div class="order-card-top">

            <strong class="order-id-button">
              ${escapeHTML(batch.batchId)}
            </strong>

            <span
              class="order-status-badge ${
                coolingState.isReady
                  ? "is-paid"
                  : ""
              }"
              data-cooling-status
            >
              ${
                coolingState.isReady
                  ? "READY"
                  : "COOLING"
              }
            </span>

          </div>

          <div class="order-items-preview">
            <p>
              ${escapeHTML(
                createItemsPreview(batch.items)
              )}
            </p>
          </div>

          <div class="order-meta-row">

            <strong class="order-total">
              ${getItemsQuantity(batch.items)} pcs
            </strong>

            <span class="order-time">
              Ready:
              ${escapeHTML(
                formatOrderTime(
                  batch.coolingReadyAt
                )
              )}
            </span>

          </div>

          <div
            class="cooling-countdown"
            data-cooling-countdown
            data-cooling-ready-at="${escapeHTML(
              batch.coolingReadyAt
            )}"
          >
            ${escapeHTML(
              coolingState.label
            )}
          </div>

          <button
            class="secondary-button ready-to-pack-button"
            type="button"
            data-batch-id="${escapeHTML(
              batch.batchId
            )}"
            ${
              coolingState.isReady
                ? ""
                : "hidden"
            }
          >
            READY TO PACK
          </button>

        </article>
      `;
    })
    .join("");
}

/* =========================================================
   COOLING COUNTDOWN
========================================================= */

function getCoolingCountdownState(
  coolingReadyAt
) {
  const readyTime =
    new Date(coolingReadyAt).getTime();

  if (!Number.isFinite(readyTime)) {
    return {
      isReady: false,
      label: "Cooling time unavailable"
    };
  }

  const remainingMs =
    readyTime - Date.now();

  if (remainingMs <= 0) {
    return {
      isReady: true,
      label: "Ready to pack"
    };
  }

  const totalSeconds =
    Math.ceil(remainingMs / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  let label = "Ready in ";

  if (hours > 0) {
    label += hours + "h ";
  }

  label +=
    String(minutes).padStart(2, "0") +
    "m " +
    String(seconds).padStart(2, "0") +
    "s";

  return {
    isReady: false,
    label: label
  };
}


function updateCoolingCountdowns() {
  const countdownElements =
    coolingOrderList.querySelectorAll(
      "[data-cooling-countdown]"
    );

  countdownElements.forEach(
    function (countdownElement) {
      const card =
        countdownElement.closest(
          "[data-cooling-batch-id]"
        );

      if (!card) return;

      const coolingState =
        getCoolingCountdownState(
          countdownElement.dataset
            .coolingReadyAt
        );

      countdownElement.textContent =
        coolingState.label;

      const statusBadge =
        card.querySelector(
          "[data-cooling-status]"
        );

      const readyButton =
        card.querySelector(
          ".ready-to-pack-button"
        );

      if (statusBadge) {
        statusBadge.textContent =
          coolingState.isReady
            ? "READY"
            : "COOLING";

        statusBadge.classList.toggle(
          "is-paid",
          coolingState.isReady
        );
      }

      if (readyButton) {
        readyButton.hidden =
          !coolingState.isReady;
      }
    }
  );
}

/* =========================================================
   14. PACKING COLUMN
========================================================= */

function renderPackingColumn() {
 const queue =
  hqState.data.packingQueue.filter(
    function (box) {
      const status =
        String(
          box.packingStatus || ""
        )
          .trim()
          .toUpperCase();

      return (
        status === "READY_TO_PACK" ||
        status === "PACKING"
      );
    }
  );

  packingCount.textContent =
    String(queue.length);

  if (queue.length === 0) {
    packingOrderList.innerHTML =
      createEmptyState(
        "No order waiting to pack."
      );

    return;
  }

  packingOrderList.innerHTML =
    queue.map(function (box) {
      const expectedQty =
        safeNumber(
          box.expectedCookieQty
        );

      const packedQty =
        safeNumber(
          box.packedCookieQty
        );

      return `
        <article
          class="order-card"
          data-order-id="${escapeHTML(
            box.orderId
          )}"
          data-order-box-id="${escapeHTML(
            box.orderBoxId
          )}"
        >

          <div class="order-card-top">

            <strong class="order-id-button">
              ${escapeHTML(box.orderId)}
            </strong>

            <span class="order-status-badge">
              ${escapeHTML(
                box.packingStatus ||
                "READY_TO_PACK"
              )}
            </span>

          </div>

          <p class="order-customer">
            ${escapeHTML(
              box.boxName ||
              "Box " +
                safeNumber(box.boxNumber)
            )}
          </p>

          <div class="order-items-preview">
            <p>
              ${escapeHTML(
                createItemsPreview(
                  box.items
                )
              )}
            </p>
          </div>

          <div class="order-meta-row">

            <strong class="order-total">
              ${packedQty}
              /
              ${expectedQty}
            </strong>

            <span class="order-time">
              Packed
            </span>

          </div>

          <div class="order-actions">

            <button
              class="card-primary-button open-packing-button"
              type="button"
              data-order-box-id="${escapeHTML(
                box.orderBoxId
              )}"
            >
              OPEN BOX
            </button>

          </div>

        </article>
      `;
    })
    .join("");
}

/* =========================================================
   14A. PACKING MODAL
========================================================= */

function findPackingBox(orderBoxId) {
  if (!hqState.data) {
    return null;
  }

  return (
    hqState.data.packingQueue.find(
      function (box) {
        return (
          String(
            box.orderBoxId || ""
          ) ===
          String(orderBoxId || "")
        );
      }
    ) || null
  );
}


function openPackingModal(orderBoxId) {
  const box =
    findPackingBox(orderBoxId);

  if (!box) {
    showToast(
      "Packing box unavailable",
      "The packing queue may have changed.",
      "error"
    );

    return;
  }

  hqState.selectedPackingBox = box;

  hqState.packingCheckedItems =
    new Set();

  packingModalTitle.textContent =
    "Pack " + (box.orderId || "Order");

  packingModalOrderId.textContent =
    box.orderId || "—";

  packingModalBoxId.textContent =
    box.orderBoxId || "—";

  packingModalBoxName.textContent =
    box.boxName ||
    "Box " + safeNumber(box.boxNumber);

  packingModalBoxNumber.textContent =
    String(
      safeNumber(box.boxNumber)
    );

  packingModalExpectedQty.textContent =
    String(
      safeNumber(
        box.expectedCookieQty
      )
    );

  renderPackingChecklist(box);

  updatePackingProgress();

  packingModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );
}


function closePackingModal() {
  if (hqState.isFinishingPacking) {
    return;
  }

  packingModal.hidden = true;

  hqState.selectedPackingBox = null;

  hqState.packingCheckedItems.clear();

  updateBodyLock();
}


/* =========================================================
   14B. PACKING CHECKLIST
========================================================= */

function createPackingChecklistItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  const checklistItems = [];

  items.forEach(function (
    item,
    itemIndex
  ) {
    const quantity =
      safeNumber(item.qty);

    const displayName =
      item.displayName ||
      item.productName ||
      item.menuCode ||
      item.productId ||
      "Cookie";

    for (
      let unitIndex = 1;
      unitIndex <= quantity;
      unitIndex += 1
    ) {
      checklistItems.push({
        checkId:
          String(item.productId || itemIndex) +
          "-" +
          unitIndex,

        productId:
          item.productId || "",

        displayName:
          displayName,

        unitNumber:
          unitIndex,

        totalUnits:
          quantity
      });
    }
  });

  return checklistItems;
}


function renderPackingChecklist(box) {
  const checklistItems =
    createPackingChecklistItems(
      box.items
    );

  if (checklistItems.length === 0) {
    packingChecklist.innerHTML = `
      <p class="packing-empty-message">
        No cookie items found for this box.
      </p>
    `;

    return;
  }

  packingChecklist.innerHTML =
    checklistItems.map(function (item) {
      return `
        <label class="packing-check-item">

          <input
            type="checkbox"
            data-packing-check-id="${escapeHTML(
              item.checkId
            )}"
          >

          <span class="packing-check-box">
            ✓
          </span>

          <span class="packing-check-copy">

            <strong>
              ${escapeHTML(
                item.displayName
              )}
            </strong>

            <small>
              Cookie
              ${item.unitNumber}
              of
              ${item.totalUnits}
            </small>

          </span>

        </label>
      `;
    })
    .join("");
}


/* =========================================================
   14C. PACKING PROGRESS
========================================================= */

function updatePackingProgress() {
  const box =
    hqState.selectedPackingBox;

  if (!box) {
    return;
  }

  const total =
    safeNumber(
      box.expectedCookieQty
    );

  const current =
    hqState.packingCheckedItems.size;

  const percentage =
    total > 0
      ? Math.min(
          100,
          Math.round(
            (current / total) * 100
          )
        )
      : 0;

  packingProgressCurrent.textContent =
    String(current);

  packingProgressTotal.textContent =
    String(total);

  packingProgressFill.style.width =
    percentage + "%";

  packingProgressBar.setAttribute(
    "aria-valuemax",
    String(total)
  );

  packingProgressBar.setAttribute(
    "aria-valuenow",
    String(current)
  );

  const isComplete =
    total > 0 &&
    current === total;

  finishPackingButton.disabled =
    !isComplete;

  finishPackingButton.textContent =
    isComplete
      ? "FINISH PACKING"
      : "PACK ALL COOKIES";
}

/* =========================================================
   14D. FINISH PACKING
========================================================= */

async function confirmFinishPacking() {
  if (
    hqState.isFinishingPacking ||
    !hqState.selectedPackingBox
  ) {
    return;
  }

  const box =
    hqState.selectedPackingBox;

  const orderBoxId =
    String(
      box.orderBoxId || ""
    ).trim();

  const orderId =
    String(
      box.orderId || ""
    ).trim();

  const expectedQty =
    safeNumber(
      box.expectedCookieQty
    );

  const checkedQty =
    hqState.packingCheckedItems.size;

  if (!orderBoxId) {
    showToast(
      "Packing box unavailable",
      "Order Box ID is missing.",
      "error"
    );

    return;
  }

  if (
    expectedQty <= 0 ||
    checkedQty !== expectedQty
  ) {
    showToast(
      "Packing incomplete",
      "Please tick every cookie before finishing.",
      "error"
    );

    return;
  }

  hqState.isFinishingPacking = true;

  setFinishPackingLoading(true);

  try {
    const payload = {
      action: "finishPacking",

      orderBoxId: orderBoxId,

      orderId: orderId,

      packedCookieQty: checkedQty,

      completedBy:
        GOOKIE_HQ_CONFIG.VERIFIED_BY
    };

    const response = await fetch(
      GOOKIE_HQ_CONFIG.API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body: JSON.stringify(payload),

        redirect: "follow"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Finish Packing request failed. HTTP " +
          response.status
      );
    }

    const result =
      await response.json();

    if (
      !result ||
      result.ok !== true
    ) {
      throw new Error(
        result && result.message
          ? result.message
          : "Packing could not be completed."
      );
    }

    packingModal.hidden = true;

    hqState.selectedPackingBox = null;
    hqState.packingCheckedItems.clear();

    showToast(
      "Packing completed",
      orderId +
        " moved to Shipping.",
      "success"
    );

    updateBodyLock();

    await loadHQData({
      showLoadingScreen: false
    });

  } catch (error) {
    console.error(
      "GOOKIE HQ finish packing error:",
      error
    );

    showToast(
      "Finish Packing failed",
      error.message ||
        "Unable to complete packing.",
      "error"
    );

  } finally {
    hqState.isFinishingPacking = false;

    setFinishPackingLoading(false);
  }
}

function setFinishPackingLoading(
  isLoading
) {
  finishPackingButton.disabled =
    isLoading;

  cancelPackingButton.disabled =
    isLoading;

  closePackingModalButton.disabled =
    isLoading;

  packingChecklist
    .querySelectorAll(
      "[data-packing-check-id]"
    )
    .forEach(function (checkbox) {
      checkbox.disabled =
        isLoading;
    });

  finishPackingButton.textContent =
    isLoading
      ? "FINISHING..."
      : "FINISH PACKING";
}

/* =========================================================
   SHIPPING MODAL
========================================================= */

function findShippingOrder(orderId) {
  if (
    !hqState.data ||
    !Array.isArray(
      hqState.data.shippingQueue
    )
  ) {
    return null;
  }

  return (
    hqState.data.shippingQueue.find(
      function (order) {
        return (
          String(
            order.orderId || ""
          ) ===
          String(orderId || "")
        );
      }
    ) || null
  );
}

function getShippingOrderMetrics(order) {
  const orderId =
    String(order.orderId || "").trim();

  if (!orderId || !hqState.data) {
    return {
      totalBoxes: 0,
      totalCookies: 0
    };
  }

  /*
   * Ambil semua box milik order yang sama daripada
   * Packing Queue. Box READY_TO_SHIP masih berada
   * dalam data walaupun tidak dipaparkan di Packing column.
   */
  const matchingBoxes =
    Array.isArray(hqState.data.packingQueue)
      ? hqState.data.packingQueue.filter(
          function (box) {
            return (
              String(box.orderId || "").trim() ===
              orderId
            );
          }
        )
      : [];

  const calculatedBoxes =
    matchingBoxes.length;

  const calculatedCookies =
    matchingBoxes.reduce(
      function (total, box) {
        return (
          total +
          safeNumber(
            box.expectedCookieQty ||
            box.packedCookieQty
          )
        );
      },
      0
    );

  return {
    totalBoxes:
      safeNumber(
        order.totalBoxes ||
        order.boxCount
      ) || calculatedBoxes,

    totalCookies:
      safeNumber(
        order.totalCookies ||
        order.cookieQty ||
        order.totalCookieQty
      ) || calculatedCookies
  };
}

function openShippingModal(orderId) {
  const order =
    findShippingOrder(orderId);

  if (!order) {
    showToast(
      "Shipping order unavailable",
      "The Shipping Queue may have changed.",
      "error"
    );

    return;
  }

const shippingMetrics =
    getShippingOrderMetrics(order);

   
  hqState.selectedShippingOrder =
    order;

  shippingModalTitle.textContent =
    "Ship " + (order.orderId || "Order");

  shippingModalOrderId.textContent =
    order.orderId || "—";

  shippingModalCustomer.textContent =
    order.customerName ||
    order.name ||
    "—";

  shippingModalBoxCount.textContent =
    String(
      safeNumber(
        order.boxCount ||
        order.totalBoxes
      )
    );

 shippingModalCookieQty.textContent =
  String(
    shippingMetrics.totalCookies
  );

  shippingModalPostcode.textContent =
    order.postcode ||
    order.postalCode ||
    "—";

  shippingModalAddress.textContent =
    order.deliveryAddress ||
    order.address ||
    "No delivery address found.";

  shippingCourierSelect.value =
    order.courier &&
    order.courier !== "TEMP COURIER"
      ? order.courier
      : "";

  shippingTrackingNumberInput.value =
    order.trackingNo ||
    order.trackingNumber ||
    "";

  hqState.shippingTrackingLink =
  order.trackingLink || "";

  updateShippingTrackingLink();
  updateShippingFormState();

  shippingModal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );
}

function closeShippingModal() {
  if (hqState.isMarkingShipped) {
    return;
  }

  shippingModal.hidden = true;

  hqState.selectedShippingOrder =
    null;

  hqState.shippingTrackingLink = "";

  shippingCourierSelect.value = "";
  shippingTrackingNumberInput.value = "";

  shippingOpenTrackingLink.href = "#";
  shippingOpenTrackingLink.hidden = true;

  shippingTrackingUnavailable.hidden =
    false;

  shippingNotificationPreview.textContent =
    "Enter the courier and tracking number to preview the customer message.";

  updateBodyLock();
}

function buildTrackingLink(
  courier,
  trackingNumber
) {
  const cleanCourier =
    String(courier || "")
      .trim()
      .toLowerCase();

  const cleanTrackingNumber =
    String(trackingNumber || "")
      .trim();

  if (!cleanTrackingNumber) {
    return "";
  }

  if (
    cleanCourier ===
    "j&t express"
  ) {
    return (
      "https://www.jtexpress.my/tracking/" +
      encodeURIComponent(
        cleanTrackingNumber
      )
    );
  }

  if (
    cleanCourier ===
    "ninja van"
  ) {
    return (
      "https://www.ninjavan.co/en-my/tracking?id=" +
      encodeURIComponent(
        cleanTrackingNumber
      )
    );
  }

  if (
    cleanCourier ===
    "pos laju"
  ) {
    return (
      "https://tracking.pos.com.my/tracking/" +
      encodeURIComponent(
        cleanTrackingNumber
      )
    );
  }

  if (
    cleanCourier ===
    "dhl ecommerce"
  ) {
    return (
      "https://www.dhl.com/my-en/home/tracking.html?tracking-id=" +
      encodeURIComponent(
        cleanTrackingNumber
      )
    );
  }

  if (
    cleanCourier ===
    "spx express"
  ) {
    return (
      "https://spx.com.my/track?tracking_number=" +
      encodeURIComponent(
        cleanTrackingNumber
      )
    );
  }

  return "";
}

function updateShippingTrackingLink() {
  const courier =
    shippingCourierSelect.value;

  const trackingNumber =
    shippingTrackingNumberInput
      .value
      .trim();

  const generatedLink =
    buildTrackingLink(
      courier,
      trackingNumber
    );

  hqState.shippingTrackingLink =
    generatedLink;

  if (generatedLink) {
    shippingOpenTrackingLink.href =
      generatedLink;

    shippingOpenTrackingLink.hidden =
      false;

    shippingTrackingUnavailable.hidden =
      true;
  } else {
    shippingOpenTrackingLink.href = "#";

    shippingOpenTrackingLink.hidden =
      true;

    shippingTrackingUnavailable.hidden =
      false;
  }
}

function createShippingNotificationPreview() {
  const order =
    hqState.selectedShippingOrder;

  if (!order) {
    return "";
  }

  const customerName =
    order.customerName ||
    order.name ||
    "there";

  const orderId =
    order.orderId || "—";

  const courier =
    shippingCourierSelect.value.trim();

  const trackingNumber =
    shippingTrackingNumberInput
      .value
      .trim();

  const trackingLink =
  String(
    hqState.shippingTrackingLink || ""
  ).trim();

  if (
    !courier ||
    !trackingNumber
  ) {
    return (
      "Enter the courier and tracking number " +
      "to preview the customer message."
    );
  }

  let message =
    "Hi " +
    customerName +
    "! Your Gookies are on the way 🚚🍪\n\n" +
    "Order ID: " +
    orderId +
    "\n" +
    "Courier: " +
    courier +
    "\n" +
    "Tracking No: " +
    trackingNumber;

  if (trackingLink) {
    message +=
      "\nTracking Link: " +
      trackingLink;
  }

  message +=
    "\n\nThank you for ordering from GOOKIE!";

  return message;
}

function updateShippingFormState() {
  const courier =
    shippingCourierSelect.value.trim();

  const trackingNumber =
    shippingTrackingNumberInput
      .value
      .trim();

  const trackingLink =
  String(
    hqState.shippingTrackingLink || ""
  ).trim();

  const isValid =
    Boolean(
      courier &&
      trackingNumber &&
      trackingLink
    );

  markAsShippedButton.disabled =
    !isValid;

  shippingNotificationPreview.textContent =
    createShippingNotificationPreview();
}

/* =========================================================
   SHIPPING WHATSAPP
========================================================= */

function buildShippingMessage(
  customerName,
  orderId,
  courier,
  trackingNo,
  trackingLink
) {
  const name =
    String(customerName || "").trim() ||
    "there";

  return [
    "Hi " + name + "! 🍪",
    "",
    "Your Gookies are officially on their way!",
    "",
    "Order ID: " + orderId,
    "Courier: " + courier,
    "Tracking Number: " + trackingNo,
    "",
    "Track your parcel:",
    trackingLink,
    "",
    "Enjoy your chunky wonders ❤️"
  ].join("\n");
}

function buildShippingWhatsAppUrl(
  phone,
  customerName,
  orderId,
  courier,
  trackingNo,
  trackingLink
) {
  const whatsappPhone =
    normalizeWhatsAppPhone(phone);

  const message =
    buildShippingMessage(
      customerName,
      orderId,
      courier,
      trackingNo,
      trackingLink
    );

  const encodedMessage =
    encodeURIComponent(message);

  const isMobileDevice =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

  if (isMobileDevice) {
    return (
      "https://wa.me/" +
      whatsappPhone +
      "?text=" +
      encodedMessage
    );
  }

  return (
    "https://web.whatsapp.com/send" +
    "?phone=" +
    whatsappPhone +
    "&text=" +
    encodedMessage
  );
}

function setMarkAsShippedLoading(
  isLoading
) {
  markAsShippedButton.disabled =
    isLoading;

  cancelShippingButton.disabled =
    isLoading;

  closeShippingModalButton.disabled =
    isLoading;

  shippingCourierSelect.disabled =
    isLoading;

  shippingTrackingNumberInput.disabled =
    isLoading;

  markAsShippedButton.textContent =
    isLoading
      ? "MARKING AS SHIPPED..."
      : "MARK AS SHIPPED";
}

async function confirmMarkAsShipped() {
  if (
    hqState.isMarkingShipped ||
    !hqState.selectedShippingOrder
  ) {
    return;
  }

  const order =
    hqState.selectedShippingOrder;

  const orderId =
    String(
      order.orderId || ""
    ).trim();

  const courier =
    shippingCourierSelect
      .value
      .trim();

  const trackingNo =
    shippingTrackingNumberInput
      .value
      .trim();

  const trackingLink =
    String(
      hqState.shippingTrackingLink || ""
    ).trim();

  if (!orderId) {
    showToast(
      "Shipping order unavailable",
      "Order ID is missing.",
      "error"
    );

    return;
  }

  if (
    !courier ||
    !trackingNo ||
    !trackingLink
  ) {
    showToast(
      "Shipping details incomplete",
      "Enter the courier and tracking number.",
      "error"
    );

    updateShippingFormState();

    return;
  }

  hqState.isMarkingShipped = true;

  setMarkAsShippedLoading(true);

  /*
   * Open an empty tab immediately so the browser
   * does not block WhatsApp after the API request.
   */
  const whatsappWindow =
    window.open(
      "about:blank",
      "_blank"
    );

  if (whatsappWindow) {
    whatsappWindow.opener = null;

    whatsappWindow.document.title =
      "Opening WhatsApp";

    whatsappWindow.document.body.innerHTML = `
      <p
        style="
          padding: 24px;
          font-family: Arial, sans-serif;
          line-height: 1.5;
        "
      >
        Preparing the GOOKIE shipping notification...
      </p>
    `;
  }

  try {
    const payload = {
      action: "markAsShipped",

      orderId: orderId,

      courier: courier,

      trackingNo: trackingNo,

      trackingLink: trackingLink,

      completedBy:
        GOOKIE_HQ_CONFIG.VERIFIED_BY
    };

    const response =
      await fetch(
        GOOKIE_HQ_CONFIG.API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(payload),

          redirect: "follow"
        }
      );

    if (!response.ok) {
      throw new Error(
        "Mark As Shipped request failed. HTTP " +
        response.status
      );
    }

    const result =
      await response.json();

    console.log(
      "Mark As Shipped result:",
      result
    );

    if (
      !result ||
      result.ok !== true
    ) {
      throw new Error(
        result && result.message
          ? result.message
          : "Order could not be marked as shipped."
      );
    }

    if (!result.customerPhone) {
      throw new Error(
        "Order was completed, but the customer phone number was not returned."
      );
    }

    const whatsappUrl =
      buildShippingWhatsAppUrl(
        result.customerPhone,

        result.customerName ||
          order.customerName ||
          order.name,

        result.orderId ||
          orderId,

        result.courier ||
          courier,

        result.trackingNo ||
          trackingNo,

        result.trackingLink ||
          trackingLink
      );

    shippingModal.hidden = true;

    hqState.selectedShippingOrder =
      null;

    hqState.shippingTrackingLink =
      "";

    shippingCourierSelect.value =
      "";

    shippingTrackingNumberInput.value =
      "";

    shippingOpenTrackingLink.href =
      "#";

    shippingOpenTrackingLink.hidden =
      true;

    shippingTrackingUnavailable.hidden =
      false;

    showToast(
      "Order shipped",
      orderId +
        " moved to Completed. Opening WhatsApp.",
      "success"
    );

    updateBodyLock();

    /*
     * Refresh HQ first.
     */
    await loadHQData({
      showLoadingScreen: false
    });

    /*
     * Then send the prepared tab to WhatsApp.
     */
    if (
      whatsappWindow &&
      !whatsappWindow.closed
    ) {
      whatsappWindow.location.replace(
        whatsappUrl
      );
    } else {
      showToast(
        "WhatsApp blocked",
        "Please allow pop-ups for GOOKIE HQ.",
        "error"
      );
    }

  } catch (error) {
    console.error(
      "GOOKIE HQ Mark As Shipped error:",
      error
    );

    if (
      whatsappWindow &&
      !whatsappWindow.closed
    ) {
      whatsappWindow.close();
    }

    showToast(
      "Mark As Shipped failed",
      error.message ||
        "Unable to complete shipment.",
      "error"
    );

  } finally {
    hqState.isMarkingShipped =
      false;

    setMarkAsShippedLoading(false);

    updateBodyLock();
  }
}

/* =========================================================
   15. SHIPPING COLUMN
========================================================= */

function renderShippingColumn() {
  const queue =
    hqState.data.shippingQueue;


  shippingCount.textContent =
    String(queue.length);


  if (queue.length === 0) {
    shippingOrderList.innerHTML =
      createEmptyState(
        "No order waiting to ship."
      );

    return;
  }


  shippingOrderList.innerHTML =
    queue.map(function (order) {

      const trackingText =
        order.trackingNo
          ? order.trackingNo
          : "Tracking pending";


      return `
        <article
          class="order-card"
          data-order-id="${escapeHTML(order.orderId)}"
        >

          <div class="order-card-top">

            <button
              class="order-id-button"
              type="button"
              data-shipping-order-id="${escapeHTML(order.orderId)}"
            >
              ${escapeHTML(order.orderId)}
            </button>

            <span class="order-status-badge is-paid">
                READY TO SHIP
            </span>

          </div>

          <p class="order-customer">
            ${escapeHTML(order.customerName || "Customer")}
          </p>

          <div class="order-items-preview">

            <p>
              ${escapeHTML(order.postcode || "No postcode")}
            </p>

            <p>
              ${escapeHTML(trackingText)}
            </p>

          </div>

          <div class="order-meta-row">

            <strong class="order-total">
              ${formatCurrency(order.grandTotal)}
            </strong>

            <span class="order-time">
              ${escapeHTML(order.courier || "Courier")}
            </span>

          </div>

<div class="order-actions">

  <button
    class="card-primary-button open-shipping-button"
    type="button"
    data-order-id="${escapeHTML(
      order.orderId
    )}"
  >
    OPEN SHIPPING
  </button>

</div>

        </article>
      `;

    }).join("");
}


/* =========================================================
   16. VERIFY PAYMENT MODAL
========================================================= */

function openVerifyPaymentModal(orderId) {

  const order =
    findVerificationOrder(orderId);


  if (!order) {
    showToast(
      "Order not found",
      "The order may already have been updated.",
      "error"
    );

    return;
  }


  hqState.selectedOrder = order;


  verifyModalOrderID.textContent =
    order.orderId || "—";

   openVerifyWhatsAppButton.onclick =
  function () {
    openCustomerWhatsApp(orderId);
  };

  verifyModalCustomerName.textContent =
    order.customerName || "—";

  verifyModalPhone.textContent =
    order.phone || "—";

  verifyModalTotal.textContent =
    formatCurrency(order.grandTotal);

  verifyModalPaymentStatus.textContent =
    order.paymentStatus || "PENDING";

  verifyModalItems.innerHTML =
    createVerifyModalItems(order.boxes);


  verifyPaymentModal.hidden = false;

  document.body.classList.add("modal-open");
}


function closeVerifyPaymentModal() {

  if (hqState.isVerifying) {
    return;
  }


  verifyPaymentModal.hidden = true;

  hqState.selectedOrder = null;

  updateBodyLock();
}

/* =========================================================
   16A. PAYMENT CONFIRMATION WHATSAPP
========================================================= */

/**
 * Converts a Malaysian customer phone number into the
 * international digit-only format required by wa.me.
 *
 * Examples:
 * 0172787879   -> 60172787879
 * 60172787879  -> 60172787879
 * +60172787879 -> 60172787879
 */
function normalizeWhatsAppPhone(phone) {
  let digits = String(phone || "")
    .replace(/\D/g, "");

  if (!digits) {
    throw new Error(
      "Customer phone number is missing."
    );
  }

  if (digits.startsWith("0")) {
    digits = "60" + digits.slice(1);
  }

  if (!digits.startsWith("60")) {
    digits = "60" + digits;
  }

  if (!/^60\d{8,11}$/.test(digits)) {
    throw new Error(
      "Customer phone number is invalid."
    );
  }

  return digits;
}


/**
 * Builds the customer-facing payment confirmation message.
 */
function buildPaymentConfirmedMessage(
  orderId,
  amountReceived
) {
  const amount = Number(amountReceived);

  if (!Number.isFinite(amount)) {
    throw new Error(
      "Payment amount is invalid."
    );
  }

  return [
    "Payment Confirmed ✅",
    "",
    "Hello! We've received your payment.",
    "",
    "Order ID: " + orderId,
    "Amount Received: RM" + amount.toFixed(2),
    "",
    "Your Gookies are now in our bake queue 🍪",
    "",
    "We'll notify you again once your order has been shipped.",
    "",
    "Thank you for supporting GOOKIE ❤️"
  ].join("\n");
}

/**
 * Creates the final wa.me URL.
 */
function buildPaymentConfirmedWhatsAppUrl(
  phone,
  orderId,
  amountReceived
) {
  const whatsappPhone =
    normalizeWhatsAppPhone(phone);

  const message =
    buildPaymentConfirmedMessage(
      orderId,
      amountReceived
    );

  const encodedMessage =
    encodeURIComponent(message);

  const isMobileDevice =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

  /*
   * Mobile:
   * Use wa.me so the phone can hand over to the
   * installed WhatsApp application.
   */
  if (isMobileDevice) {
    return (
      "https://wa.me/" +
      whatsappPhone +
      "?text=" +
      encodedMessage
    );
  }

  /*
   * Desktop:
   * Open WhatsApp Web directly and bypass the
   * intermediate "Share on WhatsApp" page.
   */
  return (
    "https://web.whatsapp.com/send" +
    "?phone=" +
    whatsappPhone +
    "&text=" +
    encodedMessage
  );
}

/* =========================================================
   17. CONFIRM VERIFY PAYMENT
========================================================= */

async function confirmVerifyPayment() {
  if (
    hqState.isVerifying ||
    !hqState.selectedOrder
  ) {
    return;
  }

  const orderId =
    hqState.selectedOrder.orderId;

  hqState.isVerifying = true;

  setVerifyButtonLoading(true);

  /*
   * Open a new tab immediately while the Verify Payment
   * button click is still considered a direct user action.
   *
   * This helps prevent desktop and mobile browsers from
   * blocking the WhatsApp tab after the async API request.
   */
  const whatsappWindow = window.open(
    "about:blank",
    "_blank"
  );

  if (whatsappWindow) {
    whatsappWindow.opener = null;

    whatsappWindow.document.title =
      "Opening WhatsApp";

    whatsappWindow.document.body.innerHTML = `
      <p
        style="
          padding: 24px;
          font-family: Arial, sans-serif;
          line-height: 1.5;
        "
      >
        Preparing the GOOKIE payment confirmation...
      </p>
    `;
  }

  try {
    const payload = {
      action: "verifyPayment",
      orderId: orderId,
      verifiedBy:
        GOOKIE_HQ_CONFIG.VERIFIED_BY
    };

    const response = await fetch(
      GOOKIE_HQ_CONFIG.API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body: JSON.stringify(payload),

        redirect: "follow"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Verification request failed. HTTP " +
          response.status
      );
    }

    const result = await response.json();

    if (!result || result.ok !== true) {
      throw new Error(
        result && result.message
          ? result.message
          : "Payment verification failed."
      );
    }

    if (!result.customerPhone) {
      throw new Error(
        "Payment was verified, but the customer phone number was not returned."
      );
    }

    if (
      result.amountReceived === "" ||
      result.amountReceived === null ||
      result.amountReceived === undefined
    ) {
      throw new Error(
        "Payment was verified, but the payment amount was not returned."
      );
    }

    const whatsappUrl =
      buildPaymentConfirmedWhatsAppUrl(
        result.customerPhone,
        result.orderId,
        result.amountReceived
      );

    verifyPaymentModal.hidden = true;

    hqState.selectedOrder = null;

    showToast(
      "Payment verified",
      orderId +
        " moved to Bake Queue. Opening WhatsApp.",
      "success"
    );

    /*
     * Refresh GOOKIE HQ in its existing tab.
     */
    await loadHQData({
      showLoadingScreen: false
    });

    /*
     * Send the pre-opened tab to WhatsApp.
     * GOOKIE HQ remains open in the original tab.
     */
    if (
      whatsappWindow &&
      !whatsappWindow.closed
    ) {
      whatsappWindow.location.replace(
        whatsappUrl
      );
    } else {
      /*
       * Fallback when the browser blocked the new tab.
       */
      showToast(
        "WhatsApp blocked",
        "Please allow pop-ups for GOOKIE HQ and verify the next order.",
        "error"
      );
    }
  } catch (error) {
    console.error(
      "GOOKIE HQ verify error:",
      error
    );

    if (
      whatsappWindow &&
      !whatsappWindow.closed
    ) {
      whatsappWindow.close();
    }

    showToast(
      "Verification failed",
      error.message,
      "error"
    );
  } finally {
    hqState.isVerifying = false;

    setVerifyButtonLoading(false);

    updateBodyLock();
  }
}

/* =========================================================
   18. ORDER DETAILS
========================================================= */

function openOrderDetails(orderId) {

  const order =
    findVerificationOrder(orderId);


  if (!order) {
    showToast(
      "Order unavailable",
      "Full details are not available in the current HQ data.",
      "error"
    );

    return;
  }


  orderDetailsModalTitle.textContent =
    order.orderId;


  orderDetailsContent.innerHTML = `
    <div class="order-details-grid">

      ${createDetailBox(
        "Customer",
        order.customerName || "—"
      )}

      ${createDetailBox(
        "Phone",
        order.phone || "—"
      )}

      ${createDetailBox(
        "Payment",
        order.paymentStatus || "PENDING"
      )}

      ${createDetailBox(
        "Grand Total",
        formatCurrency(order.grandTotal)
      )}

      ${createDetailBox(
        "Total Boxes",
        safeNumber(order.totalBoxes)
      )}

      ${createDetailBox(
        "Total Cookies",
        safeNumber(order.totalCookies)
      )}

    </div>

    <div class="order-detail-items">

      <h3>Order Items</h3>

      <p>
        ${escapeHTML(
          createBoxesPreview(order.boxes)
        )}
      </p>

    </div>
  `;


  orderDetailsModal.hidden = false;

  document.body.classList.add("modal-open");
}


function closeOrderDetailsModal() {
  orderDetailsModal.hidden = true;
  updateBodyLock();
}


/* =========================================================
   19. MISSION CONTROL
========================================================= */

function openMissionControl() {

  missionControlDrawer.classList.add("is-open");

  missionControlDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

  missionControlButton.setAttribute(
    "aria-expanded",
    "true"
  );

  pageOverlay.hidden = false;

  requestAnimationFrame(function () {
    pageOverlay.classList.add("is-visible");
  });

  document.body.classList.add("drawer-open");

  setTimeout(function () {
    missionControlSearch.focus();
  }, 250);
}


function closeMissionControl() {

  if (
    !missionControlDrawer.classList.contains(
      "is-open"
    )
  ) {
    return;
  }


  missionControlDrawer.classList.remove("is-open");

  missionControlDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

  missionControlButton.setAttribute(
    "aria-expanded",
    "false"
  );

  pageOverlay.classList.remove("is-visible");


  setTimeout(function () {
    pageOverlay.hidden = true;
  }, 240);


  document.body.classList.remove("drawer-open");
}


/* =========================================================
   20. RENDER MISSION CONTROL
========================================================= */

function renderMissionControl() {
  const data = hqState.data;


  const verifyEntries =
    data.awaitingVerification.map(function (order) {
      return {
        id: order.orderId,
        type: "order"
      };
    });


  /*
    Current hqData productionQueue is grouped by product,
    so it does not yet contain order IDs.
  */
  const bakeQueueEntries =
    data.productionQueue.map(function (item) {
      return {
        id:
          item.displayName ||
          item.menuCode ||
          item.productId,
        type: "product"
      };
    });


  const inOvenEntries =
    data.activeBatches.map(function (batch) {
      return {
        id: batch.batchId,
        type: "batch"
      };
    });


  const coolingEntries =
    data.coolingBatches.map(function (batch) {
      return {
        id: batch.batchId,
        type: "batch"
      };
    });


  const packingEntries =
    createUniqueEntries(
      data.packingQueue.map(function (box) {
        return {
          id: box.orderId,
          type: "order"
        };
      })
    );


  const shippingEntries =
  data.shippingQueue.map(function (order) {
    return {
      id: order.orderId,
      type: "order"
    };
  });

const completedEntries =
  data.completedOrders.map(function (order) {
    return {
      id: order.orderId,
      type: "order"
    };
  });
   
  renderDrawerGroup(
    drawerVerifyList,
    drawerVerifyCount,
    verifyEntries
  );


  renderDrawerGroup(
    drawerBakeQueueList,
    drawerBakeQueueCount,
    bakeQueueEntries
  );


  renderDrawerGroup(
    drawerInOvenList,
    drawerInOvenCount,
    inOvenEntries
  );


  renderDrawerGroup(
    drawerCoolingList,
    drawerCoolingCount,
    coolingEntries
  );


  renderDrawerGroup(
    drawerPackingList,
    drawerPackingCount,
    packingEntries
  );


  renderDrawerGroup(
    drawerShippingList,
    drawerShippingCount,
    shippingEntries
  );


  renderDrawerGroup(
  drawerCompletedList,
  drawerCompletedCount,
  completedEntries
);


  bindDrawerButtons();
}


function renderDrawerGroup(
  listElement,
  countElement,
  entries
) {

  countElement.textContent =
    String(entries.length);


  if (entries.length === 0) {
    listElement.innerHTML = `
      <p class="drawer-order-empty">
        No active items.
      </p>
    `;

    return;
  }


  listElement.innerHTML =
    entries.map(function (entry) {

      return `
        <button
          class="drawer-order-button"
          type="button"
          data-drawer-id="${escapeHTML(entry.id)}"
          data-drawer-type="${escapeHTML(entry.type)}"
        >
          <span>${escapeHTML(entry.id)}</span>
          <span>›</span>
        </button>
      `;

    }).join("");
}


function bindDrawerButtons() {

  document
    .querySelectorAll("[data-drawer-id]")
    .forEach(function (button) {

      button.addEventListener("click", function () {

        const itemId =
          button.dataset.drawerId;

        const itemType =
          button.dataset.drawerType;


        if (itemType === "order") {

          const verificationOrder =
            findVerificationOrder(itemId);


          if (verificationOrder) {
            closeMissionControl();

            setTimeout(function () {
              openOrderDetails(itemId);
            }, 220);

            return;
          }

        }


        highlightWorkflowItem(itemId);

        closeMissionControl();
      });

    });
}


/* =========================================================
   21. MISSION CONTROL SEARCH
========================================================= */

function handleMissionControlSearch() {

  const searchValue =
    missionControlSearch.value
      .trim()
      .toLowerCase();


  document
    .querySelectorAll(".drawer-order-button")
    .forEach(function (button) {

      const itemId =
        String(button.dataset.drawerId || "")
          .toLowerCase();


      const isMatch =
        !searchValue ||
        itemId.includes(searchValue);


      button.hidden = !isMatch;

      button.classList.toggle(
        "is-match",
        Boolean(searchValue && isMatch)
      );
    });


  document
    .querySelectorAll(".drawer-flow-group")
    .forEach(function (group) {

      const visibleButtons =
        Array.from(
          group.querySelectorAll(
            ".drawer-order-button"
          )
        ).filter(function (button) {
          return !button.hidden;
        });


      const hasSearch =
        searchValue.length > 0;


      group.hidden =
        hasSearch &&
        visibleButtons.length === 0;
    });
}


/* =========================================================
   22. HIGHLIGHT WORKFLOW ITEM
========================================================= */

function highlightWorkflowItem(itemId) {

  const cards =
    document.querySelectorAll(".order-card");


  let matchedCard = null;


  cards.forEach(function (card) {

    card.classList.remove("is-highlighted");


    if (
      card.textContent
        .toLowerCase()
        .includes(
          String(itemId).toLowerCase()
        )
    ) {
      matchedCard = card;
    }

  });


  if (!matchedCard) {
    showToast(
      "Item located",
      itemId,
      "success"
    );

    return;
  }


  matchedCard.classList.add("is-highlighted");


  matchedCard.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center"
  });


  setTimeout(function () {
    matchedCard.classList.remove(
      "is-highlighted"
    );
  }, 3500);
}


/* =========================================================
   23. CONNECTION STATUS
========================================================= */

function setConnectionStatus(status, text) {

  connectionStatus.dataset.status = status;

  connectionText.textContent = text;
}


/* =========================================================
   24. LOADING SCREEN
========================================================= */

function showHQLoadingScreen(message) {

  loadingMessage.textContent =
    message || "Loading GOOKIE HQ...";

  hqLoadingScreen.classList.remove("is-hidden");
}


function hideHQLoadingScreen() {

  hqLoadingScreen.classList.add("is-hidden");
}


function setRefreshButtonLoading(isLoading) {

  refreshHQButton.disabled = isLoading;

  refreshHQButton.textContent =
    isLoading ? "…" : "↻";
}


/* =========================================================
   25. VERIFY BUTTON LOADING
========================================================= */

function setVerifyButtonLoading(isLoading) {

  confirmVerifyPaymentButton.disabled =
    isLoading;

  cancelVerifyPaymentButton.disabled =
    isLoading;

  closeVerifyModalButton.disabled =
    isLoading;

  verifyButtonText.textContent =
    isLoading
      ? "Verifying..."
      : "Verify Payment";

  verifyButtonSpinner.hidden =
    !isLoading;
}


/* =========================================================
   26. CONNECTION ERROR
========================================================= */

function showHQConnectionError(message) {

  const errorHTML = `
    <div class="error-state">
      Unable to connect to GOOKIE HQ.<br>
      ${escapeHTML(message)}
    </div>
  `;


  verifyOrderList.innerHTML = errorHTML;
  bakeQueueOrderList.innerHTML = errorHTML;
  inOvenOrderList.innerHTML = errorHTML;
  coolingOrderList.innerHTML = errorHTML;
  packingOrderList.innerHTML = errorHTML;
  shippingOrderList.innerHTML = errorHTML;


  lastUpdatedText.textContent =
    "Connection failed";
}


/* =========================================================
   27. TOAST
========================================================= */

function showToast(
  title,
  message,
  type = "success"
) {

  clearTimeout(hqState.toastTimer);


  toastTitle.textContent =
    title;

  toastMessage.textContent =
    message;


  hqToast.classList.toggle(
    "is-error",
    type === "error"
  );


  toastIcon.textContent =
    type === "error" ? "!" : "✓";


  hqToast.hidden = false;


  hqState.toastTimer =
    setTimeout(function () {
      hqToast.hidden = true;
    }, 4200);
}


/* =========================================================
   28. AUTO REFRESH
========================================================= */

function startAutoRefresh() {

  clearInterval(hqState.autoRefreshTimer);


  hqState.autoRefreshTimer =
    setInterval(function () {

     if (
  document.hidden ||
  hqState.isLoading ||
  hqState.isVerifying ||
  hqState.isStartingBaking ||
  hqState.selectedPackingBox ||
  hqState.isFinishingPacking ||
  hqState.selectedShippingOrder ||
  hqState.isMarkingShipped
) {
  return;
}

      loadHQData({
        showLoadingScreen: false
      });

    }, GOOKIE_HQ_CONFIG.AUTO_REFRESH_MS);
}


/* =========================================================
   29. HELPER — FIND ORDER
========================================================= */

function findVerificationOrder(orderId) {

  if (!hqState.data) {
    return null;
  }


  return (
    hqState.data.awaitingVerification.find(
      function (order) {
        return order.orderId === orderId;
      }
    ) || null
  );
}


/* =========================================================
   30. HELPER — ORDER BOXES
========================================================= */

function createBoxesPreview(boxes) {

  if (!Array.isArray(boxes) || boxes.length === 0) {
    return "No box details";
  }


  return boxes.map(function (box, index) {

    const boxName =
      box.boxName ||
      box.name ||
      "Box " + (index + 1);


    const itemText =
      createItemsPreview(
        Array.isArray(box.items)
          ? box.items
          : []
      );


    return itemText
      ? boxName + ": " + itemText
      : boxName;

  }).join(" • ");
}


function createVerifyModalItems(boxes) {

  if (!Array.isArray(boxes) || boxes.length === 0) {
    return "<p>No item details available.</p>";
  }


  return boxes.map(function (box, index) {

    const boxName =
      box.boxName ||
      box.name ||
      "Box " + (index + 1);


    const items =
      Array.isArray(box.items)
        ? box.items
        : [];


    const itemsHTML =
      items.length > 0
        ? `
          <ul>
            ${items.map(function (item) {
              return `
                <li>
                  ${escapeHTML(
                    item.displayName ||
                    item.productName ||
                    item.productId ||
                    "Cookie"
                  )}
                  ×${safeNumber(item.qty)}
                </li>
              `;
            }).join("")}
          </ul>
        `
        : "<p>No item details.</p>";


    return `
      <div class="order-detail-items">
        <h3>${escapeHTML(boxName)}</h3>
        ${itemsHTML}
      </div>
    `;

  }).join("");
}


/* =========================================================
   31. HELPER — ITEMS
========================================================= */

function createItemsPreview(items) {

  if (!Array.isArray(items) || items.length === 0) {
    return "No item details";
  }


  return items.map(function (item) {

    const name =
      item.displayName ||
      item.productName ||
      item.menuCode ||
      item.productId ||
      "Cookie";


    return (
      name +
      " ×" +
      safeNumber(item.qty)
    );

  }).join(", ");
}


function getItemsQuantity(items) {

  if (!Array.isArray(items)) {
    return 0;
  }


  return items.reduce(function (total, item) {
    return total + safeNumber(item.qty);
  }, 0);
}


/* =========================================================
   32. HELPER — DETAIL BOX
========================================================= */

function createDetailBox(label, value) {

  return `
    <div class="order-detail-box">

      <span>${escapeHTML(label)}</span>

      <strong>
        ${escapeHTML(String(value))}
      </strong>

    </div>
  `;
}


/* =========================================================
   33. HELPER — EMPTY STATE
========================================================= */

function createEmptyState(message) {

  return `
    <div class="empty-state">
      <span>✓</span>
      <p>${escapeHTML(message)}</p>
    </div>
  `;
}


/* =========================================================
   34. HELPER — FORMAT CURRENCY
========================================================= */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    "en-MY",
    {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2
    }
  ).format(safeNumber(value));
}


/* =========================================================
   35. HELPER — FORMAT DATE
========================================================= */

function formatOrderTime(value) {

  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (Number.isNaN(date.getTime())) {
    return String(value);
  }


  return new Intl.DateTimeFormat(
    "en-MY",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  ).format(date);
}


function updateLastUpdated(value) {

  const date =
    value ? new Date(value) : new Date();


  if (Number.isNaN(date.getTime())) {
    lastUpdatedText.textContent =
      "HQ updated";

    return;
  }


  lastUpdatedText.textContent =
    "Last updated " +
    new Intl.DateTimeFormat(
      "en-MY",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }
    ).format(date);
}


/* =========================================================
   36. HELPER — NUMBERS
========================================================= */

function safeNumber(value) {

  const number =
    Number(value);


  return Number.isFinite(number)
    ? number
    : 0;
}


/* =========================================================
   37. HELPER — UNIQUE ENTRIES
========================================================= */

function createUniqueEntries(entries) {

  const seen = new Set();


  return entries.filter(function (entry) {

    if (!entry.id || seen.has(entry.id)) {
      return false;
    }


    seen.add(entry.id);

    return true;
  });
}


/* =========================================================
   38. HELPER — BODY LOCK
========================================================= */

function updateBodyLock() {
 const hasOpenModal =
  !verifyPaymentModal.hidden ||
  !orderDetailsModal.hidden ||
  !packingModal.hidden ||
  !shippingModal.hidden;

  document.body.classList.toggle(
    "modal-open",
    hasOpenModal
  );
}

/* =========================================================
   39. HELPER — ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   40. HELPER — WHATSAPP
========================================================= */

function normaliseWhatsAppPhone(phone) {

  let number = String(phone || "")
    .replace(/\D/g, "");

  if (!number) {
    return "";
  }

  if (number.startsWith("0")) {
    number = "60" + number.slice(1);
  }

  if (!number.startsWith("60")) {
    number = "60" + number;
  }

  return number;
}


function openCustomerWhatsApp(orderId) {

  const order = findVerificationOrder(orderId);

  if (!order) {
    showToast(
      "Order not found",
      "Customer details are unavailable.",
      "error"
    );
    return;
  }

  const phone = normaliseWhatsAppPhone(order.phone);

  if (!phone) {
    showToast(
      "Phone unavailable",
      "This order does not have a valid phone number.",
      "error"
    );
    return;
  }

  window.open(
    "https://wa.me/" + phone,
    "_blank",
    "noopener,noreferrer"
  );
}

/* =================================================
   DOUGH STOCK
================================================= */

function renderDoughStock() {
  const grid =
    document.getElementById(
      "doughStockGrid"
    );

  const alertSummary =
    document.getElementById(
      "doughAlertSummary"
    );

  const alertCount =
    document.getElementById(
      "doughAlertCount"
    );

  const alertText =
    document.getElementById(
      "doughAlertText"
    );

  const alertIcon =
    alertSummary
      ? alertSummary.querySelector(
          ".dough-alert-icon"
        )
      : null;

  if (!grid) {
    return;
  }

  const doughStock =
    hqState &&
    hqState.data &&
    Array.isArray(
      hqState.data.doughStock
    )
      ? hqState.data.doughStock
      : [];

const statusPriority = {
  OUT: 1,
  CRITICAL: 2,
  LOW: 3,
  OK: 4
};

const sortedDoughStock =
  [...doughStock].sort(function (a, b) {
    const statusA =
      String(
        a.status || "OK"
      ).toUpperCase();

    const statusB =
      String(
        b.status || "OK"
      ).toUpperCase();

    const priorityA =
      statusPriority[statusA] || 99;

    const priorityB =
      statusPriority[statusB] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const readyA =
      Number(a.readyStock) || 0;

    const readyB =
      Number(b.readyStock) || 0;

    if (readyA !== readyB) {
      return readyA - readyB;
    }

    return String(
      a.displayName || ""
    ).localeCompare(
      String(
        b.displayName || ""
      )
    );
  });
     
  const doughStockButton =
    document.getElementById(
      "doughStockDrawerButton"
    );

  const doughStockBadge =
    document.getElementById(
      "doughStockDrawerBadge"
    );

  if (!doughStock.length) {
    grid.innerHTML = `
      <div class="dough-stock-loading">
        No dough stock data found.
      </div>
    `;

    if (alertCount) {
      alertCount.textContent = "0";
    }

    if (alertText) {
      alertText.textContent =
        "Dough Alerts";
    }

    if (alertSummary) {
      alertSummary.dataset.status =
        "ok";

      alertSummary.classList.remove(
        "dough-alert-shake"
      );
    }

    if (alertIcon) {
      alertIcon.textContent = "✓";
    }

    if (doughStockBadge) {
      doughStockBadge.textContent =
        "0";
    }

    if (doughStockButton) {
      doughStockButton.classList.remove(
        "is-warning",
        "is-danger"
      );
    }

    return;
  }

  const alertItems =
    doughStock.filter(function (item) {
      const status =
        String(
          item.status || ""
        ).toUpperCase();

      return (
        status === "LOW" ||
        status === "CRITICAL" ||
        status === "OUT"
      );
    });

  const criticalItems =
    doughStock.filter(function (item) {
      const status =
        String(
          item.status || ""
        ).toUpperCase();

      return (
        status === "CRITICAL" ||
        status === "OUT"
      );
    });

  const outItems =
    doughStock.filter(function (item) {
      return (
        String(
          item.status || ""
        ).toUpperCase() === "OUT"
      );
    });

  grid.innerHTML =
  sortedDoughStock
    .map(function (item) {
      return buildDoughStockCard_(
        item
      );
    })
    .join("");

  if (alertCount) {
    alertCount.textContent =
      String(alertItems.length);
  }

  if (alertSummary) {
    alertSummary.classList.remove(
      "dough-alert-shake"
    );
  }

  if (outItems.length > 0) {
    if (alertSummary) {
      alertSummary.dataset.status =
        "danger";
    }

    if (alertText) {
      alertText.textContent =
        "Dough Out of Stock";
    }

    if (alertIcon) {
      alertIcon.textContent = "🚨";
    }

    startDoughAlertShake_();

  } else if (
    criticalItems.length > 0
  ) {
    if (alertSummary) {
      alertSummary.dataset.status =
        "danger";
    }

    if (alertText) {
      alertText.textContent =
        "Critical Dough";
    }

    if (alertIcon) {
      alertIcon.textContent = "🚨";
    }

    startDoughAlertShake_();

  } else if (
    alertItems.length > 0
  ) {
    if (alertSummary) {
      alertSummary.dataset.status =
        "warning";
    }

    if (alertText) {
      alertText.textContent =
        alertItems.length === 1
          ? "Dough Alert"
          : "Dough Alerts";
    }

    if (alertIcon) {
      alertIcon.textContent = "⚠️";
    }

  } else {
    if (alertSummary) {
      alertSummary.dataset.status =
        "ok";
    }

    if (alertText) {
      alertText.textContent =
        "Dough Ready";
    }

    if (alertIcon) {
      alertIcon.textContent = "✓";
    }
  }

  if (doughStockBadge) {
    doughStockBadge.textContent =
      String(alertItems.length);
  }

  if (doughStockButton) {
    doughStockButton.classList.remove(
      "is-warning",
      "is-danger"
    );

    if (
      outItems.length > 0 ||
      criticalItems.length > 0
    ) {
      doughStockButton.classList.add(
        "is-danger"
      );
    } else if (
      alertItems.length > 0
    ) {
      doughStockButton.classList.add(
        "is-warning"
      );
    }
  }
}

/* =================================================
   BUILD DOUGH CARD
================================================= */

function buildDoughStockCard_(item) {
  const readyStock =
    Number(item.readyStock) || 0;

  const targetStock =
    Number(item.targetStock) || 0;

  const status =
    String(
      item.status || "OK"
    ).toUpperCase();

  const statusClass =
    status.toLowerCase();

  let percentage = 0;

  if (targetStock > 0) {
    percentage =
      Math.round(
        readyStock /
        targetStock *
        100
      );
  }

  percentage =
    Math.max(
      0,
      Math.min(
        percentage,
        100
      )
    );

  let buttonText =
    "Top Up Stock";

  if (status === "LOW") {
    buttonText =
      "⚠️ Top Up Stock";
  }

  if (status === "CRITICAL") {
    buttonText =
      "🚨 TOP UP NOW";
  }

  if (status === "OUT") {
    buttonText =
      "🚨 PREPARE NOW";
  }

  const displayName =
    escapeHTML(
      item.displayName ||
      item.productId ||
      "Unknown Dough"
    );

  const productId =
    escapeHTML(
      item.productId || ""
    );

  const doughId =
    escapeHTML(
      item.doughId || ""
    );

  return `
    <article
      class="dough-card ${statusClass}"
      data-product-id="${productId}"
      data-dough-id="${doughId}"
    >

      <div class="dough-title">

        <h4>${displayName}</h4>

        <span class="dough-status">
          ${status}
        </span>

      </div>


      <div
        class="dough-progress"
        aria-label="${readyStock} out of ${targetStock}"
      >

        <div
          class="dough-progress-fill"
          style="width:${percentage}%"
        ></div>

      </div>


      <div class="dough-qty">

        <span>
          ${readyStock} ready
        </span>

        <span>
          Target ${targetStock}
        </span>

      </div>


      <button
        class="topup-btn"
        type="button"
        data-action="top-up-dough"
        data-product-id="${productId}"
        data-dough-id="${doughId}"
      >
        ${buttonText}
      </button>

    </article>
  `;
}


/* =================================================
   DOUGH ALERT SHAKE
================================================= */

let doughAlertShakeTimer = null;

function startDoughAlertShake_() {
  const alertSummary =
    document.getElementById(
      "doughAlertSummary"
    );

  if (!alertSummary) {
    return;
  }

  if (doughAlertShakeTimer) {
    clearInterval(
      doughAlertShakeTimer
    );
  }

  doughAlertShakeTimer =
    setInterval(function () {
      alertSummary.classList.remove(
        "dough-alert-shake"
      );

      void alertSummary.offsetWidth;

      alertSummary.classList.add(
        "dough-alert-shake"
      );

      setTimeout(function () {
        alertSummary.classList.remove(
          "dough-alert-shake"
        );
      }, 650);

    }, 10000);
}

/* =================================================
   DOUGH STOCK EVENTS
================================================= */

document.addEventListener(
  "click",
  function (event) {
    const alertButton =
      event.target.closest(
        "#doughAlertSummary"
      );

    if (alertButton) {
      const doughSection =
        document.getElementById(
          "doughStockSection"
        );

      if (doughSection) {
        doughSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      return;
    }


    const topUpButton =
      event.target.closest(
        '[data-action="top-up-dough"]'
      );

    if (!topUpButton) {
      return;
    }

    openDoughTopUpModal_(
  topUpButton.dataset.doughId,
  topUpButton.dataset.productId
);
     
  }
);

/* =================================================
   DOUGH TOP-UP MODAL
================================================= */


function openDoughTopUpModal_(
  doughId,
  productId
) {
  const modal =
    document.getElementById(
      "doughTopUpModal"
    );

  if (!modal) {
    return;
  }

  const doughStock =
    hqState &&
    hqState.data &&
    Array.isArray(
      hqState.data.doughStock
    )
      ? hqState.data.doughStock
      : [];

   const statusPriority = {
  OUT: 1,
  CRITICAL: 2,
  LOW: 3,
  OK: 4
};

const sortedDoughStock =
  [...doughStock].sort(function (a, b) {
    const statusA =
      String(
        a.status || "OK"
      ).toUpperCase();

    const statusB =
      String(
        b.status || "OK"
      ).toUpperCase();

    const priorityA =
      statusPriority[statusA] || 99;

    const priorityB =
      statusPriority[statusB] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const readyA =
      Number(a.readyStock) || 0;

    const readyB =
      Number(b.readyStock) || 0;

    if (readyA !== readyB) {
      return readyA - readyB;
    }

    return String(
      a.displayName || ""
    ).localeCompare(
      String(
        b.displayName || ""
      )
    );
  });

  const item =
    doughStock.find(function (stockItem) {
      return (
        String(stockItem.doughId) ===
          String(doughId) &&
        String(stockItem.productId) ===
          String(productId)
      );
    });

  if (!item) {
    console.error(
      "Dough stock item not found:",
      doughId,
      productId
    );

    return;
  }

  activeDoughTopUpItem_ = item;

  document.getElementById(
    "doughTopUpDoughId"
  ).value = item.doughId || "";

  document.getElementById(
    "doughTopUpProductId"
  ).value = item.productId || "";

  document.getElementById(
    "doughTopUpProductName"
  ).textContent =
    item.displayName ||
    item.productId ||
    "Dough Stock";

  document.getElementById(
    "doughTopUpCurrentStock"
  ).textContent =
    String(
      Number(item.readyStock) || 0
    );

  document.getElementById(
    "doughTopUpQuantity"
  ).value = "";

  document.getElementById(
    "doughTopUpNotes"
  ).value = "";

  document.getElementById(
    "doughTopUpNewStock"
  ).textContent =
    String(
      Number(item.readyStock) || 0
    ) + " pcs";

  const message =
    document.getElementById(
      "doughTopUpMessage"
    );

  message.hidden = true;
  message.textContent = "";
  message.className =
    "dough-modal-message";

  modal.hidden = false;

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(function () {
    document.getElementById(
      "doughTopUpQuantity"
    ).focus();
  }, 50);
}


function closeDoughTopUpModal_() {
  const modal =
    document.getElementById(
      "doughTopUpModal"
    );

  if (!modal) {
    return;
  }

  modal.hidden = true;

  document.body.classList.remove(
    "modal-open"
  );

  activeDoughTopUpItem_ = null;
}


/* =================================================
   LIVE STOCK PREVIEW
================================================= */

document.addEventListener(
  "input",
  function (event) {
    if (
      event.target.id !==
      "doughTopUpQuantity"
    ) {
      return;
    }

    const currentStock =
      activeDoughTopUpItem_
        ? Number(
            activeDoughTopUpItem_
              .readyStock
          ) || 0
        : 0;

    const quantity =
      Math.max(
        0,
        Number(event.target.value) || 0
      );

    document.getElementById(
      "doughTopUpNewStock"
    ).textContent =
      String(
        currentStock + quantity
      ) + " pcs";
  }
);



/* =================================================
   CLOSE MODAL EVENTS
================================================= */

document.addEventListener(
  "click",
  function (event) {
    const closeButton =
      event.target.closest(
        '[data-action="close-dough-modal"]'
      );

    if (!closeButton) {
      return;
    }

    closeDoughTopUpModal_();
  }
);


document.addEventListener(
  "keydown",
  function (event) {
    if (event.key === "Escape") {
      closeDoughTopUpModal_();
    }
  }
);

