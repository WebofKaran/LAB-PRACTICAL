```javascript
const runButton = document.getElementById("runPipeline");
const clearLogsButton = document.getElementById("clearLogs");
const openAppButton = document.getElementById("openApp");

const pipelineStatus = document.getElementById("pipelineStatus");
const buildNumber = document.getElementById("buildNumber");
const stageCount = document.getElementById("stageCount");
const executionTime = document.getElementById("executionTime");
const progressBar = document.getElementById("progressBar");
const consoleElement = document.getElementById("console");
const deploymentBadge = document.getElementById("deploymentBadge");

const stages = [...document.querySelectorAll(".stage")];
const connectors = [...document.querySelectorAll(".connector")];

let isRunning = false;
let build = 104;
let elapsedSeconds = 0;
let timerInterval = null;

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

function getTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour12: false
    });
}

function log(message, type = "info") {
    const line = document.createElement("div");
    line.className = `console-line ${type === "error" ? "error" : ""}`;

    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = `[${getTime()}]`;

    const label = document.createElement("span");
    label.className = "label";
    label.textContent =
        type === "error" ? "[ERROR]" :
        type === "success" ? "[SUCCESS]" :
        "[INFO]";

    const content = document.createElement("span");
    content.textContent = message;

    line.append(timestamp, label, content);
    consoleElement.appendChild(line);

    consoleElement.scrollTop = consoleElement.scrollHeight;
}

function updateTimer() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    executionTime.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
    elapsedSeconds = 0;
    updateTimer();

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetStages() {
    stages.forEach((stage) => {
        stage.classList.remove("active", "success", "failed");
        stage.querySelector(".stage-status").textContent = "Pending";
    });

    connectors.forEach((connector) => {
        connector.style.color = "#52617a";
    });

    progressBar.style.width = "0%";
    stageCount.textContent = "0 / 6";

    deploymentBadge.textContent = "OFFLINE";
    deploymentBadge.className = "badge offline";

    openAppButton.disabled = true;
}

function setStageStatus(index, status) {
    const stage = stages[index];
    const statusElement = stage.querySelector(".stage-status");

    stage.classList.remove("active", "success", "failed");
    stage.classList.add(status);

    const labels = {
        active: "Running...",
        success: "✓ Success",
        failed: "✕ Failed"
    };

    statusElement.textContent = labels[status];

    if (status === "success" && connectors[index]) {
        connectors[index].style.color = "#36d399";
    }

    const completed = stages.filter((item) =>
        item.classList.contains("success")
    ).length;

    stageCount.textContent = `${completed} / ${stages.length}`;
    progressBar.style.width =
        `${(completed / stages.length) * 100}%`;
}

async function executeStage(index, name, messages) {
    setStageStatus(index, "active");
    log(`Stage ${index + 1}/6: ${name} started.`);

    for (const message of messages) {
        await sleep(550);
        log(message);
    }

    await sleep(350);

    setStageStatus(index, "success");
    log(`${name} completed successfully.`, "success");
}

async function runPipeline() {
    if (isRunning) return;

    isRunning = true;
    runButton.disabled = true;
    runButton.textContent = "Running Pipeline...";

    build++;
    buildNumber.textContent = `#${build}`;

    resetStages();
    consoleElement.replaceChildren();

    pipelineStatus.textContent = "Running";
    startTimer();

    log(`Starting pipeline build #${build}.`);
    log("Environment: LOCAL DEMO");
    log("Note: This interface simulates a CI/CD pipeline.");

    const pipelineStages = [
        {
            name: "GitHub Checkout",
            messages: [
                "Connecting to source repository...",
                "Fetching branch: main",
                "Checking out application files."
            ]
        },
        {
            name: "Jenkins Initialization",
            messages: [
                "Reading Jenkinsfile...",
                "Loading pipeline configuration...",
                "Preparing build environment."
            ]
        },
        {
            name: "Test",
            messages: [
                "Checking application file structure...",
                "Running simulated validation...",
                "Validation checks passed."
            ]
        },
        {
            name: "Docker Image Build",
            messages: [
                "Reading Dockerfile...",
                "Preparing application image...",
                `Created simulated image: web-app:${build}`
            ]
        },
        {
            name: "Docker Hub Push",
            messages: [
                "Preparing registry authentication...",
                "Tagging image: web-app:latest",
                "Simulating image push to Docker Hub."
            ]
        },
        {
            name: "Deployment",
            messages: [
                "Preparing container configuration...",
                "Mapping host port 8080 to container port 80...",
                "Simulating container startup."
            ]
        }
    ];

    try {
        for (let i = 0; i < pipelineStages.length; i++) {
            const stage = pipelineStages[i];

            await executeStage(i, stage.name, stage.messages);
        }

        pipelineStatus.textContent = "Success";

        deploymentBadge.textContent = "SIMULATED";
        deploymentBadge.className = "badge online";

        openAppButton.disabled = false;

        log("All six pipeline stages completed.", "success");
        log("Demo deployment finished successfully.", "success");
        log("No real image was built or container deployed.");
    } catch (error) {
        pipelineStatus.textContent = "Failed";
        log(error.message || "Pipeline execution failed.", "error");
    } finally {
        stopTimer();
        isRunning = false;
        runButton.disabled = false;
        runButton.innerHTML = "<span>▶</span> Run Pipeline";
    }
}

runButton.addEventListener("click", runPipeline);

clearLogsButton.addEventListener("click", () => {
    consoleElement.replaceChildren();
    log("Console cleared. Waiting for pipeline execution.");
});

openAppButton.addEventListener("click", () => {
    log(
        "Demo mode: localhost:8080 is not automatically started. " +
        "Deploy the application with Docker to open it."
    );
});
```
