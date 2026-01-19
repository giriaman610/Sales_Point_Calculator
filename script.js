const RULES = {
    AE: [
        {
            name: "Revenue % Achievement",
            calc: v =>
                v < 90 ? 0 :
                    v < 100 ? 20 :
                        v < 105 ? 30 :
                            v < 110 ? 38 : 45
        },
        {
            name: "ARPU",
            calc: v =>
                v < 4500 ? 0 :
                    v < 5000 ? 3 :
                        v < 5300 ? 5 :
                            v < 5700 ? 7 :
                                v < 6300 ? 9 : 12
        },
        {
            name: "CVR %",
            calc: v =>
                v < 30 ? 0 :
                    v < 35 ? 4 :
                        v < 39 ? 7 :
                            v < 42 ? 11 :
                                v < 45 ? 13 : 15
        },
        {
            name: "Green Weeks",
            calc: v => Math.min(v * 5, 20)
        },
        {
            name: "Refunds (0 or >=1)",
            type: "select",
            options: [
                { label: "0 Refund", value: 0 },
                { label: ">1 Refund", value: 1 }

            ],
            calc: v => v === 0 ? 10 : 0
        }

    ],

    SDR: [
        {
            name: "Demo % Achievement",
            calc: v =>
                v < 90 ? 0 :
                    v < 100 ? 20 :
                        v < 105 ? 30 :
                            v < 110 ? 38 : 45
        },
        {
            name: "Avg TAT (min)",
            calc: v =>
                v > 20 ? 0 :
                    v > 13 ? 6 : 10
        },
        {
            name: "DS %",
            calc: v =>
                v < 15 ? 0 :
                    v < 17 ? 6 : 10
        },
        {
            name: "DD %",
            calc: v =>
                v < 80 ? 0 :
                    v < 85 ? 6 : 10
        },
        {
            name: "Green Weeks",
            calc: v => Math.min(v * 5, 20)
        },
        {
            name: "Bonus CVR %",
            calc: v => v >= 35 ? 5 : 0
        }
    ]
};
function renderMetrics() {
    const role = document.getElementById("role").value;
    const container = document.getElementById("metrics");
    container.innerHTML = "";

    RULES[role].forEach((m, i) => {
        const div = document.createElement("div");
        div.className = "metric";

        let input;
        if (m.type === "select") {
            input = document.createElement("select");
            m.options.forEach(o => {
                const opt = document.createElement("option");
                opt.value = o.value;
                opt.textContent = o.label;
                input.appendChild(opt);
            });
        } else {
            input = document.createElement("input");
            input.type = "number";
            input.placeholder = "Enter value";
        }

        input.oninput = updateTotal;

        div.innerHTML = `
      <div class="metric-header">
        <span class="metric-title">${m.name}</span>
        <span class="metric-points" id="p${i}">0</span>
      </div>
    `;

        div.appendChild(input);
        container.appendChild(div);
    });

    updateTotal();
}


function updateTotal() {
    const role = document.getElementById("role").value;
    const inputs = document.querySelectorAll("#metrics input, #metrics select");
    let total = 0;
    inputs.forEach((inp, i) => {
        // If input is empty, show 0 points
        if (inp.value === "") {
            document.getElementById(`p${i}`).innerText = 0;
            return;
        }

        const val = Number(inp.value);
        const pts = RULES[role][i].calc(val);

        document.getElementById(`p${i}`).innerText = pts;
        total += pts;
    });

    document.getElementById("totalPoints").innerText = total;
}

renderMetrics();
