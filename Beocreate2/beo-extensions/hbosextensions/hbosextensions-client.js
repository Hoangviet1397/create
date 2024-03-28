var hbosextensions = (function() {

descriptions = {};

$(document).on("hbosextensions", function(event, data) {
	if (data.header == "status") {
		console.log("Updating extensions");
		beo.notify();
		console.log(data.content.list.length);
		generateMenu(data.content.list);
		generateDockerMenu(data.content.sizes);
	}
	if (data.header == "processState") {
		beo.notify({title: data.content.state+"...", message: "Please wait.", timeout: false});
	}
	if (data.header == "error") {
		beo.notify({title: "Error", message: data.content.message, timeout: false});
        }
});

function startExtension(extensionid) {
	console.log("Starting "+extension);
	beo.sendToProduct("hbosextensions", {header: "start", content: {name: extensionid}});
}

function stopExtension(extensionid) {
        console.log("Stopping "+extension);
        beo.sendToProduct("hbosextensions", {header: "stop", content: {name: extensionid}});
}

function cleanup() {
	beo.sendToProduct("hbosextensions", {header: "cleanup"});
}


function generateMenu(extensionList) {

    let menuContent = document.getElementById("extensions-menu");
	console.log("1");

    // Clear existing content
    menuContent.innerHTML = '';

    extensionList.forEach(ext => {
	    console.log(ext);
	let extToggle = `${ext.name.toLowerCase().replace(' ', '-')}-toggle`;
	let menuDescription = document.createElement("p");
	infoStr = ext.description + " (";

	if (ext.version=="not installed") {
            infoStr += "not installed";
	} else {
	    infoStr += ext.version + " installed";
        }
	menuDescription.textContent = infoStr+")";

        let menuItem = document.createElement("div");
        menuItem.classList.add("menu-item", "toggle");
        menuItem.setAttribute("id", extToggle);

	console.log(ext);

	if (ext.status.toLowerCase()=="running") {
		menuItem.classList.add("on");
		menuItem.setAttribute("onclick", `hbosextensions.stopExtension('${ext.name}')`);
	} else {
		menuItem.setAttribute("onclick", `hbosextensions.startExtension('${ext.name}')`);
	}

        let menuLabel = document.createElement("div");
        menuLabel.classList.add("menu-label");
        menuLabel.textContent = ext.fullname;


        let menuToggle = document.createElement("div");
	menuItem.setAttribute("id", `${ext.name.toLowerCase().replace(' ', '-')}-toggle`);
        menuToggle.classList.add("menu-toggle");

        menuItem.appendChild(menuLabel);
        menuItem.appendChild(menuToggle);

        menuContent.appendChild(menuItem);
	menuContent.appendChild(menuDescription);

	if (ext.updateAvailable) {
		let updateButton = document.createElement("div");
        	updateButton.classList.add(["button"] );
        	updateButton.setAttribute("onclick", `hbosextensions.updateExtension('${ext.name}')`);
        	updateButton.textContent = "Update to "+ext.githubversion;
		menuContent.appendChild(updateButton);
	}

        menuContent.appendChild(document.createElement("hr"));

    });
}

function generateDockerMenu(sizes) {
	console.log(sizes);

	element = document.getElementById("containersize");
        if (element) {
            element.textContent = sizes.containerSize;
        }

        element = document.getElementById("imagesize");
        if (element) {
            element.textContent = sizes.imageSize
        } 
}

function updateExtension(extensionName) {
	console.log("Updating "+extension);
        beo.sendToProduct("hbosextensions", {header: "update", content: {name: extensionName}});
}

return {
	updateExtension: updateExtension,
	startExtension: startExtension,
	stopExtension: stopExtension,
	cleanup: cleanup,
	generateMenu: generateMenu,
	generateDockerMenu: generateDockerMenu
};

})();
