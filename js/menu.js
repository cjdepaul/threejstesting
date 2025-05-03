import { celestialBodies, getPosition, camera } from './main.js';

document.addEventListener('DOMContentLoaded', function() {
    const dropMenu = document.getElementById('dropmenu');
    const menuItems = document.getElementById('menuitems');
    let isMenuOpen = false;

    dropMenu.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        menuItems.style.display = isMenuOpen ? 'block' : 'none';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target)) {
            isMenuOpen = false;
            menuItems.style.display = 'none';
        }
    });

    // Setup button handlers
    document.querySelectorAll('.goto-button').forEach(button => {
        button.addEventListener('click', function(e) {
            stopFollowing();
            const celestialName = e.target.closest('.celestial-item')
                                        .querySelector('.celestial-name').textContent.toLowerCase();
            const celestialBody = celestialBodies[celestialName];
            const position = getPosition(celestialBody);
            camera.position.set(position.x - 200, position.y + 150, position.z + 150);
            camera.lookAt(position.x, position.y, position.z);

        });
    });

    let followingBody = null;
    let followInterval = null;

    function updateFollowButtons() {
        document.querySelectorAll('.follow-button').forEach(btn => {
            const itemName = btn.closest('.celestial-item')
                               .querySelector('.celestial-name').textContent.toLowerCase();
            btn.textContent = (itemName === followingBody) ? 'Unfollow' : 'Follow';
        });
    }

    function startFollowing(bodyName, body) {
        if (followInterval) {
            clearInterval(followInterval);
        }
        followingBody = bodyName;
        followInterval = setInterval(() => {
            const pos = getPosition(body);
            camera.position.set(pos.x - 200, pos.y + 200, pos.z + 200);
            camera.lookAt(pos.x, pos.y, pos.z);
        }, 16);
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
});
