const input = document.getElementById("barcodeInput");
const statusEl = document.getElementById("status");
const card = document.getElementById("result");

const nameEl = document.getElementById("productName");
const brandEl = document.getElementById("brand");
const categoryEl = document.getElementById("category");
const imgEl = document.getElementById("productImage");
const descriptionEl = document.getElementById("description");

const historyBody = document.querySelector("#history tbody");

input.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const barcode = input.value.trim();
    if (!barcode) return;

    statusEl.textContent = "🔎 Looking up product...";
    card.classList.add("hidden");

    try {
      const response = await fetch(`/lookup/${barcode}`);
      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      if (data && data.name) {
        nameEl.textContent = data.name;
        brandEl.textContent = data.brand || "N/A";
        categoryEl.textContent = data.category || "N/A";
        descriptionEl.textContent = data.description || "No description available";
        imgEl.src = data.imageUrl || "https://via.placeholder.com/80";
        card.classList.remove("hidden");
        statusEl.textContent = "✅ Product found!";

        // Add to scan history
        const row = document.createElement("tr");
        row.innerHTML = `<td>${new Date().toLocaleTimeString()}</td><td>${barcode}</td><td>${data.name}</td>`;
        historyBody.prepend(row);
      } else {
        statusEl.textContent = "⚠️ Barcode not found in GO UPC database.";
      }
    } catch (error) {
      console.error(error);
      statusEl.textContent = "⚠️ Error fetching product info.";
    }

    input.value = "";
    input.focus();
  }
});
