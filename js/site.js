'use strict';

/* global variables: */

var site_vars = {
  /* control container elements: */
  'el_content_control': document.getElementById('content_control'),
  'el_content_control_close': document.getElementById('content_control_close_click'),
  'el_content_control_menu_img': document.getElementById('content_control_menu_img'),
  /* select elements: */
  'country_sel': document.getElementById('plot_control_country'),
  'city_sel': document.getElementById('plot_control_city'),
  /* plot selection element: */
  'el_content_plot_select': document.getElementById('content_plot_select'),
  /* plot selection images: */
  'img_plot_select': 'img/control/select.png',
  'img_plot_selected': 'img/control/selected.png',
  /* plot container element: */
  'el_content_plot': document.getElementById('content_plot'),
  /* plot image element: */
  'el_content_plot_img': document.getElementById('content_plot_img'),
  /* data file to load: */
  'data_dir': 'data/',
  'data_file': 'aq_data.json',
  /* plots directory: */
  'plots_dir': 'https://gws-access.jasmin.ac.uk/public/aq_stripes',
  /* countries and cities data: */
  'countries': null,
  'cities': null,
  'city_data': null,
  /* selected country and city: */
  'country': null,
  'city': null,
  /* selected plot: */
  'plot_index': null
};

/* functions */

/* update plot selection icons: */
function update_plot_selects() {
  /* get plot information for selected city: */
  var city_data = site_vars['city_data'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  /* get selected plot index: */
  var plot_index = site_vars['plot_index'];
  /* plot selection element: */
  var content_plot_select = site_vars['el_content_plot_select'];
  /* clear out html: */
  var content_plot_select_html = '';
  /* for each available plot, add icon img: */
  var img_plot_select = site_vars['img_plot_select'];
  var img_plot_selected = site_vars['img_plot_selected'];
  for (var i = 0 ; i < plots_count ; i++) {
    /* check if this is selected plot: */
    if (i == plot_index) {
      content_plot_select_html += '<img src="' + img_plot_selected +
                                  '" class="img_plot_selected">';
    } else {
      content_plot_select_html += '<img src="' + img_plot_select +
                                  '" class="img_plot_select" ' +
                                  'onclick="update_plot(' + i + ')">';
    };
  };
  /* update html: */
  content_plot_select.innerHTML = content_plot_select_html;
};

/* update city information: */
function update_city() {
  /* get country and city from site variables: */
  var country = site_vars['country'];
  var city = site_vars['city'];
  /* get cities for this country: */
  var cities = [];
  for (var i in site_vars['cities'][country]) {
    cities.push(i);
  };
  /* get select element: */
  var city_sel = site_vars['city_sel'];
  /* get selected city, if possible: */
  if (city_sel.selectedIndex < 0) {
    var city_selected = undefined;
  } else {
    var city_selected = city_sel.options[city_sel.selectedIndex].value;
  };
  /* if stored city is defined the same as selected, return: */
  if ((city != null) && (city != undefined) &&
      (city == city_selected)) {
    return;
  } else {
    city = city_selected;
  };
  /* if city is not recognised or defined ... : */
  if ((cities.indexOf(city) < 0) || (city == null) ||
      (city == undefined)) {
    /* invalid city, pick one at random: */
    var city_index = Math.floor(Math.random() * cities.length);
    city = cities[city_index];
  };
  /* add city select html: */
  var my_html = '';
  for (var i = 0; i < cities.length; i++) {
    var my_city = cities[i];
    my_html += '<option value="' + my_city + '"';
    if (my_city == city) {
      my_html += ' selected';
    };
    my_html += '>' + my_city + '</option>';
  };
  city_sel.innerHTML = my_html;
  /* store selected city and data: */
  site_vars['city'] = city;
  site_vars['city_data'] = site_vars['cities'][country][city];
  /* check for stored plot index, else set to 0: */
  var plot_index = site_vars['plot_index'];
  if ((plot_index == null) || (plot_index == undefined)) {
    plot_index = 0;
    site_vars['plot_index'] = plot_index;
  };
  /* update plot select icons: */
  update_plot_selects();
  /* update plots: */
  display_plots();
};

/* update country information: */
function update_country() {
  /* get country value from site variables: */
  var country = site_vars['country'];
  /* get country data: */
  var countries = site_vars['countries'];
  countries.sort();
  /* get select elements: */
  var country_sel = site_vars['country_sel'];
  /* get selected country, if possible: */
  if (country_sel.selectedIndex < 0) {
    var country_selected = undefined;
  } else {
    var country_selected = country_sel.options[country_sel.selectedIndex].value;
  };
  /* if stored country is defined and the same as selected, return: */
  if ((country != null) && (country != undefined) &&
      (country == country_selected)) {
    return;
  /* else, use selected value: */
  } else {
    country = country_selected;
  };
  /* if country is not recognised or defined ... : */
  if ((countries.indexOf(country) < 0) || (country == null) ||
      (country == undefined)) {
    /* invalid country, pick one at random: */
    var country_index = Math.floor(Math.random() * countries.length);
    country = countries[country_index];
  };
  /* add country select html: */
  var my_html = '';
  for (var i = 0; i < countries.length; i++) {
    var my_country = countries[i];
    my_html += '<option value="' + my_country + '"';
    if (my_country == country) {
      my_html += ' selected';
    };
    my_html += '>' + my_country + '</option>';
  };
  country_sel.innerHTML = my_html;
  /* store selected country: */
  site_vars['country'] = country;
  /* update city information: */
  site_vars['city'] = undefined;
  update_city();
};

/* function to display plots */
function display_plots() {
  /* get country and city from site variables: */
  var country = site_vars['country'];
  var city = site_vars['city'];
  /* if country is not defined, update: */
  if ((country == null) || (country == undefined)) {
     update_country();
  };
  /* if city is not defined, update: */
  if ((city == null) || (city == undefined)) {
     update_city();
  };
  /* re-get country and city from site variables: */
  country = site_vars['country'];
  city = site_vars['city'];
  /* log message: */
  console.log('selected country: ' + country + ', selected city: ' + city);
  /* get plot data for this city: */
  var city_data = site_vars['city_data'];
  var plots_dir = site_vars['plots_dir'] + '/' +  city_data['plots_dir'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  /* display selected plot index: */
  var plot_index = site_vars['plot_index'];
  var plot_el = site_vars['el_content_plot_img'];
  plot_el.src = plots_dir + '/' + plots[plot_index];
};

/* function to update plot by index: */
function update_plot(plot_index) {
  /* if no plot index, return: */
  if ((plot_index == null) || (plot_index == undefined)) {
    return;
  };
  /* check plot index is valid: */
  var city_data = site_vars['city_data'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  if ((plot_index < 0) || (plots_count <= plot_index)) {
    return;
  };
  /* store plot index: */
  site_vars['plot_index'] = plot_index;
  /* update plots: */
  display_plots();
  /* update plot selection icons: */
  update_plot_selects();
};

/* function to load site data: */
async function load_data() {
  /* data file to load: */
  var data_dir = site_vars['data_dir'];
  var data_file = site_vars['data_file'];
  var data_url = data_dir + '/' + data_file;
  /* get data using fetch: */
  await fetch(data_url).then(async function(data_req) {
    /* if successful: */
    if (data_req.status == 200) {
      /* store json information from request: */
      var aq_data = await data_req.json();
      site_vars['countries'] = aq_data['countries'];
      site_vars['cities'] = aq_data['cities'];
      /* display plots: */
      display_plots();
    } else {
      /* log error: */
      console.log('* failed to load data from file: ' + data_file);
    };
  });
};

/* function to toggle control element visibility: */
function content_control_toggle() {
  /* control container elements: */
  var content_control = site_vars['el_content_control'];
  var content_control_close = site_vars['el_content_control_close'];
  var content_control_menu_img = site_vars['el_content_control_menu_img'];
  /* plot container element: */
  var content_plot = site_vars['el_content_plot'];
  /* get control flex basis value: */
  var control_basis = content_control.style.flexBasis;
  /* if controls are not visible: */
  if (control_basis == '0%') {
    /* show the controls: */
    content_control_menu_img.style.width = '0em';
    content_control.style.marginRight = '0.5em';
    content_control.style.minWidth = '12em';
    content_plot.style.flexBasis = '80%';
    content_control.style.flexBasis = '20%';
    content_control_close.style.color = '';
  } else {
    /* hide the controls: */
    content_control_close.style.color = 'rgba(255, 255, 255, 0)';
    content_control.style.flexBasis = '0%';
    content_plot.style.flexBasis = '100%';
    content_control.style.minWidth = '0em';
    content_control.style.marginRight = '0em';
    content_control_menu_img.style.width = '1.5em';
  };
};

/* page loading / set up function: */
function load_page() {
  /* load data: */
  load_data();
  /* if window is less than 800px, initially hide controls: */
  if (document.body.clientWidth < 800) {
    content_control_toggle();
  };
};

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* set up the page ... : */
  load_page();
});

/* select listeners: */
site_vars['country_sel'].addEventListener('change', update_country);
site_vars['city_sel'].addEventListener('change', update_city);
