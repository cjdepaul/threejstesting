import { celestialBodies, getPosition, camera, updateSpeed, updateSensitivity, getCurrentSpeed, getCurrentSensitivity } from './main.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize menu elements
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const mainMenuContent = document.getElementById('mainMenuContent');
    const movementBtn = document.getElementById('movementSettingsBtn');
    const celestialBtn = document.getElementById('celestialBodiesBtn');
    const movementContent = document.getElementById('movementSettingsContent');
    const celestialContent = document.getElementById('celestialBodiesContent');
    const closeMenuBtn = document.getElementById('closeMenu');

    // Closes the menu and resets the display of buttons
    function closeMenu() {
        mainMenuContent.classList.remove('show');
        mainMenuBtn.style.display = 'block';
        movementContent.classList.remove('show');
        celestialContent.classList.remove('show');
    }

    // Event listeners for menu buttons
    mainMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mainMenuContent.classList.toggle('show');
        mainMenuBtn.style.display = 'none';
    });

    movementBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        celestialContent.classList.remove('show');
        movementContent.classList.toggle('show');
    });

    celestialBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        movementContent.classList.remove('show');
        celestialContent.classList.toggle('show');
    });

    closeMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMenu();
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('#menu')) {
            closeMenu();
        }
    });

    // Button handlers for celestial bodies
    document.querySelectorAll('.goto-button').forEach(button => {
        button.addEventListener('click', function(e) {
            stopFollowing();
            const celestialName = e.target.closest('.celestial-item')
                                        .querySelector('.celestial-name').textContent.toLowerCase();
            const celestialBody = celestialBodies[celestialName];
            const position = getPosition(celestialBody);
            if (celestialName == "sun") {
                camera.position.set(position.x, position.y + 2000, position.z + 2000);
            }
            else {
                camera.position.set(position.x - 200, position.y + 150, position.z + 150);
            }
            camera.lookAt(position.x, position.y, position.z);

        });
    });

    let followingBody = null;
    let followInterval = null;

    function updateFollowButtons() {
        document.querySelectorAll('.celestial-item').forEach(item => {
            const itemName = item.querySelector('.celestial-name').textContent.toLowerCase();
            const followBtn = item.querySelector('.follow-button');
            if (followBtn) {
                followBtn.textContent = (itemName === followingBody) ? 'Unfollow' : 'Follow';
                if (itemName === followingBody) {
                    item.classList.add('following');
                } else {
                    item.classList.remove('following');
                }
            }
        });
    }

    function startFollowing(bodyName, body) {
        if (followInterval) {
            clearInterval(followInterval);
        }
        followingBody = bodyName;
        followInterval = setInterval(() => {
            const pos = getPosition(body);
            const time = Date.now() * 0.00025; 
            const radius = 280; 
            const x = pos.x + radius * Math.cos(time);
            const z = pos.z + radius * Math.sin(time);
            camera.position.set(x, pos.y + 200, z);
            camera.lookAt(pos.x, pos.y, pos.z);
        }, 1);
        updateFollowButtons();
    }

    function stopFollowing() {
        if (followInterval) {
            clearInterval(followInterval);
            followInterval = null;
        }
        followingBody = null;
        updateFollowButtons();
    }

    document.querySelectorAll('.follow-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const celestialName = e.target.closest('.celestial-item')
                                        .querySelector('.celestial-name').textContent.toLowerCase();
            const celestialBody = celestialBodies[celestialName];

            if (followingBody === celestialName) {
                stopFollowing();
            } else {
                startFollowing(celestialName, celestialBody);
            }
        });
    });

    // Initialize sliders with current values
    const speedSlider = document.getElementById('speed');
    const sensitivitySlider = document.getElementById('camera-sensitivity');
    const speedValue = document.getElementById('speed-value');
    const sensitivityValue = document.getElementById('sensitivity-value');

    speedSlider.value = getCurrentSpeed();
    sensitivitySlider.value = getCurrentSensitivity();
    speedValue.textContent = getCurrentSpeed();
    sensitivityValue.textContent = getCurrentSensitivity();

    // Update display values while dragging
    speedSlider.addEventListener('input', function(e) {
        speedValue.textContent = e.target.value;
    });

    sensitivitySlider.addEventListener('input', function(e) {
        sensitivityValue.textContent = e.target.value;
    });

    // Update actual values when letting go
    speedSlider.addEventListener('change', function(e) {
        updateSpeed(parseInt(e.target.value));
    });

    sensitivitySlider.addEventListener('change', function(e) {
        updateSensitivity(parseInt(e.target.value));
    });
});
