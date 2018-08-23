ct_$('html').ultimateGDPR({
    popup_style: {
        position: 'bottom-panel', // bottom-left, bottom-right, bottom-panel, top-left, top-right, top-panel
        distance: '20px', // distance betwen popup and window border
        box_style: 'classic', // classic, modern
        box_shape: 'rounded', // rounded, squared
        background_color: '#ffffff', // color in hex
        text_color: '#4159FB', // color in hex
        button_shape: 'rounded', // squared, rounded
        button_color: '#4159FB', // color in hex
        button_size: 'normal', // normal, large
        gear_icon_position: 'bottom-right', // top-left, top-center, top-right, center-left, center-right, bottom-left, bottom-center, bottom-right
        gear_icon_color: '#ffffff', //color in hex
    },
    popup_options: {
        always_show: false, // true, false, when true popup is displayed always even when consent is given
        gear_display: true, // true, false when true displays icon with cookie settings
        popup_text: 'Cookies To make this site work properly, we sometimes place small data files called cookies on your device. Most big websites do this too.', // text for popup
        accept_button_text: 'Accept', // string, text for accept button
        read_button_text: 'Read More', // string, text for read more button
        read_more_link: '/privacy', // string, link to the Read More page
        advenced_button_text: 'Change Settings', // string, text for advenced button
        grouped_popup: true, // true, false, when true cookies are grouped
        default_group: 'group_4', // string: name, select group that will be selected by default
        content_before_slider: '<h2>Privacy settings</h2><div class="ct-ultimate-gdpr-cookie-modal-desc"><p>Decide which cookies you want to allow.</p><p>You can change these settings at any time. However, this can result in some functions no longer being available. For information on deleting the cookies, please consult your browser’s help function.</p> <span>Learn more about the cookies we use.</span></div><h3>With the slider, you can enable or disable different types of cookies:</h3>',
        // string: this content will be displayed before cookies slider, html tags alowed
        accepted_text: 'This website will:',
        declined_text: "This website won't:",
        save_btn: 'Save & Close', // string, text for modal close btn
        prevent_cookies_on_document_write: true, // prevent cookies on document write when there is no agreement for cookies
        check_country: true,
        countries_prefixes: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB'],
        reset_link_selector: '.ct-uGdpr-reset',
        first_party_cookies_whitelist: [],
        third_party_cookies_whitelist: [],
        cookies_groups: {
            group_1: {
                name: 'Essential', // string: name
                enable: true, // true, false, you can disable this group by using false
                icon: 'fas fa-check', // string icon class from font-awesome see -> http://fontawesome.io
                list: ['Remember your cookie permission setting', 'Allow session cookies', 'Gather information you input into a contact forms, newsletter and other forms across all pages', 'Keep track of what you input in shopping cart', 'Authenticate that you are logged into your user account', 'Remember language version you selected'], // array list of options
                blocked_url: [], // array list of url blocked scripts
                local_cookies_name: [], // array, list of local cookies names
            },
            group_2: {
                name: 'Functionality', // string: name
                enable: true, // true, false, you can disable this group by using false
                icon: 'fas fa-cog', // string icon class from font-awesome see -> http://fontawesome.io
                list: ['Remember social media settings', 'Remember selected region and country',],
                blocked_url: [], // array list of url blocked scripts
                local_cookies_name: [], // array, list of local cookies names
            },
            group_3: {
                name: 'Analytics', // string: name
                enable: true, // true, false, you can disable this group by using false
                icon: 'fas fa-chart-bar', // string icon class from font-awesome see -> http://fontawesome.io
                list: ['Keep track of your visited pages and interaction taken', 'Keep track about your location and region based on your IP number', 'Keep track on the time spent on each page', 'Increase the data quality of the statistics functions'],
                blocked_url: [], // array list of url blocked scripts
                local_cookies_name: [], // array, list of local cookies names
            },
            group_4: {
                name: 'Advertising', // string: name
                enable: true, // true, false, you can disable this group by using false
                icon: 'fas fa-exchange-alt', // string icon class from font-awesome see -> http://fontawesome.io
                list: ['Use information for tailored advertising with third parties', 'Allow you to connect to social sites', 'Identify device you are using', 'Gather personally identifiable information such as name and location'],
                blocked_url: [], // array list of url blocked scripts
                local_cookies_name: [], // array, list of local cookies names
            },
        },
    },
    forms: {
        prevent_forms_send: true, // true, false, when enabled forms get checkbox with info that need to be checked for form send
        prevent_forms_text: 'I consent to the storage of my data according to the Privacy Policy', // string: information for checkbox info
        prevent_forms_exclude: [], // array of selectors (classes, id), this forms will be excluded from prevent
    },
    configure_mode: {
        on: true,
        parametr: '?configure123456',
        dependencies: ['https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', '/stylesheets/ct-ultimate-gdpr.min.css', 'https://use.fontawesome.com/releases/v5.0.13/css/all.css'],
        debug: false, // bool: true false, debug mode on/off (showing all 3rd party cookies urls, blockes urls names of all local cookies and names of blocked local cookies )
    }
});