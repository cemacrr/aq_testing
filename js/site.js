'use strict';

/* global variables: */

var site_vars = {
  /* control container elements: */
  'el_content_control': document.getElementById('content_control'),
  'el_content_control_close': document.getElementById('content_control_close_click'),
  'el_content_control_menu_img': document.getElementById('content_control_menu_img'),
  /* select elements: */
  'country_sel': document.getElementById('plot_control_country'),
  'country_selected': null,
  'city_sel': document.getElementById('plot_control_city'),
  'city_selected': null,
  /* plot container element: */
  'el_content_plot': document.getElementById('content_plot'),
  /* plot image element: */
  'el_content_plot_img': document.getElementById('content_plot_img'),
  /* data file to load: */
  'data_dir': 'data/',
  'data_file': 'aq_data.json',
  /* plots directory: */
  'plots_dir': 'https://gws-access.jasmin.ac.uk/public/aq_stripes/plots',
  /* countries and cities data: */
  'countries': null,
  'country': null,
  'cities': null,
  'city': null,
  'city_data': null
};

/* functions */

/* update city information: */
function update_cities(country, city) {
  /* get country from site_vars: */
  country = site_vars['country_selected'];
  /* get cities for this country: */
  var cities = [];
  for (var i in site_vars['cities'][country]) {
    cities.push(i);
  };
  /* get select element: */
  var city_sel = site_vars['city_sel'];
  /* if city is not recognised or defined, try get it from selected item: */
  if ((cities.indexOf(city) < 0) || (city == null) ||
      (city == undefined)) {
     city = city_sel.options[city_sel.selectedIndex].value;
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
  /* store selected city: */
  site_vars['city_selected'] = city;
  /* if this is not the currently plotted country and city: */
  if ((country != site_vars['country']) || (city != site_vars['city'])) {
    /* update the plots: */
    display_plots(country, city);
  };
};

/* update country information: */
function update_country(country, city) {
  /* get country data: */
  var countries = site_vars['countries'];
  countries.sort();
  /* get select elements: */
  var country_sel = site_vars['country_sel'];
  /* if country is not recognised or defined, try get it from selected item: */
  if ((countries.indexOf(country) < 0) || (country == null) ||
      (country == undefined)) {
     country = country_sel.options[country_sel.selectedIndex].value;
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
  site_vars['country_selected'] = country;
  /* update city information: */
  update_cities(country, city);
};

/* function to display plots */
function display_plots(country, city) {
  /* get country and city data: */
  var countries_data = site_vars['countries'];
  var cities_data = site_vars['cities'];
  /* check for valid country: */
  if (countries_data.indexOf(country) < 0) {
    /* invalid country, pick one at random: */
    var country_index = Math.floor(Math.random() * countries_data.length);
    country = countries_data[country_index];
  };
  /* get cities for this country: */
  var cities = [];
  for (var i in site_vars['cities'][country]) {
    cities.push(i);
  };
  /* check for valid city: */
  if (cities.indexOf(city) < 0) {
    /* invalid city, pick one at random: */
    var city_index = Math.floor(Math.random() * cities.length);
    city = cities[city_index];
  };
  /* log message: */
  console.log('selected country: ' + country + ', selected city: ' + city);
  /* get plot data for this city: */
  var city_data = cities_data[country][city];
  var plots_dir = site_vars['plots_dir'] + '/' +  city_data['plots_dir'];
  var plots = city_data['plots'].sort();
  var plots_count = plots.length;
  /* display first plot in plot element: */
  var plot_el = site_vars['el_content_plot_img'];
  plot_el.src = plots_dir + '/' + plots[0];
  /* store country and city information: */
  site_vars['country'] = country;
  site_vars['city'] = city;
  site_vars['city_data'] = city_data;
  /* update select elements: */
  update_country(country, city);
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
site_vars['city_sel'].addEventListener('change', update_cities);
