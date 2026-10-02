function compatible(works_min, works_max, tweak_compatibility) {
    let currentiOS = parseFloat(('' + (/CPU.*OS ([0-9_]{1,})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', ''));
    works_min = numerize(works_min);
    works_max = numerize(works_max);
    let el = document.querySelector('.compatibility');
    if (!el) return;
    if (currentiOS < works_min) {
        el.innerHTML = '你的 iOS 版本过低，此插件不兼容你的设备。本插件兼容 ' + tweak_compatibility + '。 / Your iOS version is too old. This package requires iOS ' + tweak_compatibility + '.';
        el.classList.add('red');
    } else if (currentiOS > works_max) {
        el.innerHTML = '你的 iOS 版本过高，此插件不兼容你的设备。本插件兼容 ' + tweak_compatibility + '。 / Your iOS version is too new. This package supports iOS ' + tweak_compatibility + '.';
        el.classList.add('red');
    } else if (String(currentiOS) !== 'NaN') {
        el.innerHTML = '此插件与你当前设备兼容！This package is compatible with your device!';
        el.classList.add('green');
    }
}

function numerize(x) {
    if (!x || x.indexOf('.') === -1) {
        return parseFloat(x || '0');
    }
    return parseFloat(x.substring(0, x.indexOf('.')) + '.' + x.substring(x.indexOf('.') + 1).replace('.', ''));
}

function swap(hide, show) {
    for (var i = document.querySelectorAll(hide).length - 1; i >= 0; i--) {
        document.querySelectorAll(hide)[i].style.display = 'none';
    }
    for (var j = document.querySelectorAll(show).length - 1; j >= 0; j--) {
        document.querySelectorAll(show)[j].style.display = 'block';
    }
    var showBtn = document.querySelector('.nav_btn' + show + '_btn');
    var hideBtn = document.querySelector('.nav_btn' + hide + '_btn');
    if (showBtn) showBtn.classList.add('active');
    if (hideBtn) hideBtn.classList.remove('active');
}

function externalize() {
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        links[i].setAttribute('target', '_blank');
        links[i].setAttribute('rel', 'noopener noreferrer');
    }
}

function darkMode(isOled) {
    var darkColor = isOled ? 'black' : '#161616';
    document.querySelector('body').style.color = 'white';
    document.querySelector('body').style.background = darkColor;
    var nodes = document.querySelectorAll('.subtle_link, .subtle_link > div > div, .subtle_link > div > div > p');
    for (var i = nodes.length - 1; i >= 0; i--) {
        nodes[i].style.color = 'white';
    }
}

function repoSearchInit() {
    var searchInput = document.getElementById('search-input');
    var statusFilter = document.getElementById('status-filter');
    var channelFilter = document.getElementById('channel-filter');
    var envFilter = document.getElementById('env-filter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.package-entry'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.package-section'));
    var emptyState = document.getElementById('empty-state');

    if (!searchInput || cards.length === 0) {
        return;
    }

    function matches(card) {
        var haystack = [
            card.dataset.name || '',
            card.dataset.bundle || '',
            card.dataset.developer || '',
            card.dataset.section || '',
            card.dataset.env || '',
            card.dataset.arch || ''
        ].join(' ').toLowerCase();

        var query = searchInput.value.trim().toLowerCase();
        var status = statusFilter ? statusFilter.value : '';
        var channel = channelFilter ? channelFilter.value : '';
        var env = envFilter ? envFilter.value : '';

        if (query && haystack.indexOf(query) === -1) return false;
        if (status && (card.dataset.status || '') !== status) return false;
        if (channel && (card.dataset.channel || '') !== channel) return false;
        if (env && (card.dataset.env || '').toLowerCase().indexOf(env) === -1) return false;
        return true;
    }

    function applyFilters() {
        var visibleCount = 0;
        cards.forEach(function(card) {
            var visible = matches(card);
            card.hidden = !visible;
            if (visible) visibleCount++;
        });

        sections.forEach(function(section) {
            var visibleChildren = section.querySelectorAll('.package-entry:not([hidden])').length;
            section.hidden = visibleChildren === 0;
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    [searchInput, statusFilter, channelFilter, envFilter].forEach(function(el) {
        if (!el) return;
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
    });

    applyFilters();
}

if (navigator.userAgent.toLowerCase().indexOf('dark') !== -1) {
    darkMode(navigator.userAgent.toLowerCase().indexOf('oled') !== -1 || navigator.userAgent.toLowerCase().indexOf('pure-black') !== -1);
}
