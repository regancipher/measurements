// Configuration options
const init_phones = ["Harman 2019 IE v2 Target.txt"],
      DIR = "data/",
      default_channels = ["L", "R"],
      default_normalization = "dB",
      default_norm_db = 60,
      default_norm_hz = 500,
      max_channel_imbalance = 5,
      alt_layout = true,
      alt_sticky_graph = true,
      alt_animated = true,
      alt_header = false,
      alt_header_new_tab = true,
      alt_tutorial = true,
      alt_augment = true,
      site_url = "",
      share_url = true,
      watermark_text = "",
      watermark_image_url = "",
      page_title = "Frequency Responses - ReganCipher",
      page_description = "View and compare frequency response graphs for earphones",
      accessories = true,
      externalLinksBar = false,
      restricted = false,
      expandable = false,
      expandableOnly = false,
      headerHeight = "0px",
      darkModeButton = true,
      targetDashed = true,
      targetColorCustom = false,
      labelsPosition = "bottom-left",
      stickyLabels = true,
      analyticsEnabled = true,
      exportableGraphs = true,
      extraEnabled = true,
      extraUploadEnabled = true,
      extraEQEnabled = true,
      extraEQBands = 10,
      extraEQBandsMax = 20,
      extraToneGeneratorEnabled = true;

// Specify which targets to display
const targets = [
    { 
        type: "Neutral",
        files: ["Diffuse Field", "Etymotic", "Free Field", "Innerfidelity ID"]
    },
    { 
        type: "Preference",
        files: ["Harman 2019 IE v2", "Harman 2018 OE", "Rtings", "Sonarworks"]
    },
    { 
        type: "Reviewer",
        files: ["Antdroid", "Bad Guy", "Banbeucmas", "Crinacle", "Precogvision", "Super Review"]
    }
];

// Functions to support config options
function watermark(svg) {
    let wm = svg.append("g")
        .attr("transform", "translate(" + (pad.l + W/2) + "," + (pad.t + H/2 - 20) + ")")
        .attr("opacity", 0.2);
    
    if (watermark_image_url) {
        wm.append("image")
            .attrs({
                x: -64,
                y: -64,
                width: 128,
                height: 128,
                "xlink:href": watermark_image_url
            });
    }
    
    if (watermark_text) {
        wm.append("text")
            .attrs({
                x: 0,
                y: 70,
                "font-size": 28,
                "text-anchor": "middle",
                "class": "graph-name"
            })
            .text(watermark_text);
    }
    
    let wmSq = svg.append("g")
        .attr("opacity", 0.2);
    
    wmSq.append("image")
        .attrs({
            x: 481,
            y: 152,
            width: 150,
            height: 141,
            "class": "wm-squiglink-logo",
            "xlink:href": "squiglink-giggle.svg"
        });
    
    wmSq.append("text")
        .attrs({
            x: 641,
            y: 314,
            "font-size": 10,
            "transform": "translate(0,0)",
            "text-anchor": "end",
            "class": "wm-squiglink-address"
        })
        .text("regancipher.squig.link");
}

// Parse fr text data
function tsvParse(fr) {
    return fr.split(/[\r\n]/)
        .map(l => l.trim())
        .filter(l => l && l[0] !== '*')
        .map(l => l.split(/[\s,]+/).map(e => parseFloat(e)).slice(0, 2))
        .filter(t => !isNaN(t[0]) && !isNaN(t[1]));
}

// Apply stylesheet based layout options
function setLayout() {
    function applyStylesheet(styleSheet) {
        var docHead = document.querySelector("head"),
            linkTag = document.createElement("link");
        
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("type", "text/css");
        linkTag.setAttribute("href", styleSheet);
        docHead.append(linkTag);
    }

    if (!alt_layout) {
        applyStylesheet("style.css");
    } else {
        applyStylesheet("style-alt.css");
        applyStylesheet("style-alt-theme.css");
    }
}
setLayout();

// Set restricted mode
function setRestricted() {
    if (restricted) {
        max_compare = 2;
        restrict_target = false;
        disallow_target = true;
        premium_html = "<h2>You gonna pay for that?</h2><p>To use target curves, or more than two graphs, <a target='_blank' href='https://crinacle.com/wp-login.php?action=register'>subscribe</a> or upgrade to Patreon <a target='_blank' href='https://www.patreon.com/join/crinacle/checkout?rid=3775534'>Silver tier</a> and switch to <a target='_blank' href='https://crinacle.com/graphs/iems/graphtool/premium/'>the premium tool</a>.</p>";
    }
}
setRestricted();

// Configure HTML accessories
const paragraphs = `
    <h2>Welcome!</h2>

    <p>Hi, I'm <strong>ReganCipher</strong>. I'm an audio tech reviewer in the UK, with a background in DJ'ing and music production, sharing the decks at clubs and festivals all over Europe with the likes of Axwell, Steve Angello, Eric Prydz, Fedde Le Grand and Calvin Harris during the early 2000's.</p>

    <p>Now I spend my spare time testing and reviewing mostly budget audio gear, with a hope that one day I'll find an affordable endgame and be able to share it with all of you! Until then, I hope you find the measurements here useful in finding something to your liking, or tweaking what you already have.</p>

    <h2>Connect With Me</h2>

    <p>If you want to check out my work elsewhere, here are my social links:</p>

    <ul style="list-style: none; padding-left: 20px; line-height: 1.6;">
        <li>🌐 Website: <a href="https://regancipher.com" target="_blank">regancipher.com</a></li>
        <li>🔗 Bio Link: <a href="https://bio.link/regancipher" target="_blank">bio.link/regancipher</a></li>
        <li>📸 Instagram: <a href="https://instagram.com/regancipher" target="_blank">instagram.com/regancipher</a></li>
        <li>🎧 Head-fi: <a href="https://www.head-fi.org/members/regancipher.535074/#showcase-reviews" target="_blank">my head-fi review inventory</a></li>
        <li>☕ Ko-Fi: <a href="https://kofi.com/regancipher" target="_blank">kofi.com/regancipher</a></li>
        <li>📊 Squiglink: <a href="https://regancipher.squig.link" target="_blank">regancipher.squig.link</a></li>
        <li>🌳 LinkTree: <a href="https://linktr.ee/rcaudio" target="_blank">linktr.ee/rcaudio</a></li>
    </ul>
`;

const widgets = `
    <div class="accessories-widgets">
        <div class="widget">
            <img width="200" src="cringraph-logo.svg"/>
        </div>

        <div class="widget">
            <img width="200" src="cringraph-logo.svg"/>
        </div>

        <div class="widget">
            <img width="200" src="cringraph-logo.svg"/>
        </div>
    </div>
`;

// Set which accessories to use
const whichAccessoriesToUse = paragraphs;

// Set up analytics
function setupGraphAnalytics() {
    if (analyticsEnabled) {
        const pageHead = document.querySelector("head"),
              graphAnalytics = document.createElement("script"),
              graphAnalyticsSrc = "graphAnalytics.js";
        
        graphAnalytics.setAttribute("src", graphAnalyticsSrc);
        pageHead.append(graphAnalytics);
    }
}
setupGraphAnalytics();

// Header configuration
const headerLogoText = "",
      headerLogoImgUrl = "rcheader.png",
      headerLinks = [
    {
        name: "YouTube",
        url: "https://www.youtube.com/channel/UCH6h7agGcLNqqw_zV8DMD5Q"
    },
    {
        name: "Headfi",
        url: "https://www.head-fi.org/members/regancipher.535074/#showcase-reviews"
    },
    {
        name: "Reddit",
        url: "https://www.reddit.com/user/Radiant-Cherry-7973/?rdt=57804"
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/regancipher/?hl=gb"
    }
];

// Tutorial definitions
const tutorialDefinitions = [
    {
        name: "Sub bass",
        width: "20.1%",
        description: "Lorem ipsum."
    },
    {
        name: "Mid bass",
        width: "19.2%",
        description: "Lorem ipsum."
    },
    {
        name: "Lower midrange",
        width: "17.4%",
        description: "Lorem ipsum."
    },
    {
        name: "Upper midrange",
        width: "20%",
        description: "Lorem ipsum."
    },
    {
        name: "Presence region",
        width: "6%",
        description: "Lorem ipsum."
    },
    {
        name: "Mid treble",
        width: "7.3%",
        description: "Lorem ipsum."
    },
    {
        name: "Air",
        width: "10%",
        description: "Lorem ipsum."
    }
];
