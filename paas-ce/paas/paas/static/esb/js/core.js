/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
(function() {
  // 一个帮助输入key-value对的组件
  var KeyValueInputPair = function(options) {
    var self = this;
    self.options = options;
    self.container = options.container;
    self.initial = options.initial;

    // 以给定的容器初始化
    self.initialize = function() {
      var template = Handlebars.compile($('#tmpl-kvip').html());
      var template_row = Handlebars.compile($('#tmpl-kvip-row').html());

      // 如果设置了初始值，使用这些初始值来初始化
      if (self.initial && !$.isEmptyObject(self.initial)) {
        var part_rows = '';
        $.each(self.initial, function(key, value) {
            part_rows += template_row({key: key, value: value});
        });
      } else {
        var part_rows = template_row();
      }

      self.container.html(template({
        label: self.options.label,
        part_rows: part_rows
      }));


      // bind events
      self.container.find('.pair-add-row').bind('click', function() {
        self.container.find('.kv-rows').append(template_row());
      });
      self.container.on('click', '.pair-remove-row', function() {
          $(this).parents('.kv-row').remove();
      });
    };

    //获取当前填写的Key-Value对
    self.get_value = function() {
      var result = {};
      self.container.find('.kv-row').each(function(i, row) {
        var input_key = $(row).find('input[name="key"]');
        var input_value = $(row).find('input[name="value"]');
        if (input_key.val()) {
          result[input_key.val()] = input_value.val();
        }
      });
      return result;
    };
  };


  window.KeyValueInputPair = KeyValueInputPair;
})();


function populate(frm, data) {
    $.each(data, function(key, value){
      var $ctrl = $('[name='+key+']', frm);
      if ($ctrl.prop("tagName")) {
          $ctrl.val(value);
          return;
      }
      switch($ctrl.attr("type"))
      {
          case "text" :
          case "hidden":
          $ctrl.val(value);
          break;
          case "radio" : case "checkbox":
          $ctrl.each(function(){
             if($(this).attr('value') == value) {  $(this).attr("checked",value); } });
          break;
      }
    });
}


// simplified $.deparam analog
var deparam = function(paramString){
    var result = {};
    if(!paramString){
        return result;
    }
    $.each(paramString.split('&'), function(index, value){
        if(value){
            var param = value.split('=');
            result[param[0]] = param[1];
        }
    });
    return result;
};


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// This plugin comes from:
//
// http://www.keyframesandcode.com/resources/javascript/jQuery/demos/populate-demo.html

jQuery.fn.populate = function(obj, options) {

  // ------------------------------------------------------------------------------------------
  // JSON conversion function

  // convert
  function parseJSON(obj, path) {
    // prepare
    path = path || '';

    // iteration (objects / arrays)
    if(obj == undefined) {
      // do nothing
    } else if(obj.constructor == Object) {
      for(var prop in obj) {
        var name	= path + (path == '' ? prop : '[' +prop+ ']');
        parseJSON(obj[prop], name);
      }
    }

    else if(obj.constructor == Array) {
      for(var i = 0; i < obj.length; i++) {
        var index	= options.useIndices ? i : '';
        index		= options.phpNaming ? '[' +index+']' : index;
        var name	= path + index;
        parseJSON(obj[i], name);
      }
      // assignment (values)
    } else {
      // if the element name hasn't yet been defined, create it as a single value
      if(arr[path] == undefined) {
        arr[path] = obj;
        // if the element name HAS been defined, but it's a single value, convert to an array and add the new value
      } else if(arr[path].constructor != Array) {
        arr[path] = [arr[path], obj];
        // if the element name HAS been defined, and is already an array, push the single value on the end of the stack
      } else {
        arr[path].push(obj);
      }
    }
  };


  // ------------------------------------------------------------------------------------------
  // population functions

  function debug(str) {
    if(window.console && console.log) {
      console.log(str);
    }
  }

  // To get an escape selector (see http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/)
  function jq( myid ) {
        return "#" + myid.replace(/(:|\[|\]|\.)/g, "\\$1");
    }

  function getElementName(name) {
    if (!options.phpNaming) {
      name = name.replace(/\[\]$/,'');
    }
    return name;
  }

  function populateElement(parentElement, name, value) {
    var selector	= options.identifier == 'id' ? '#' + name : '[' +options.identifier+ '="' +name+ '"]';
    var element		= jQuery(selector, parentElement);
    value			= value.toString();
    value			= value == 'null' ? '' : value;
    element.html(value);
  }

  function populateFormElement(form, name, value) {
    // check that the named element exists in the form
    var name	= getElementName(name); // handle non-php naming
    var element	= form[name];

    // if the form element doesn't exist, check if there is a tag with that id
    if(element == undefined) {
      // look for the element
      element = jQuery(jq(name), form);
      if(element && element.length != 0) {
        element.html(value);
        return true;
      }

      // nope, so exit
      if(options.debug) {
        debug('No such element as ' + name);
      }
      return false;
    }

    // debug options
    if(options.debug) {
      _populate.elements.push(element);
    }

    // now, place any single elements in an array.
    // this is so that the next bit of code (a loop) can treat them the
    // same as any array-elements passed, ie radiobutton or checkox arrays,
    // and the code will just work
    elements = element.type == undefined && element.length ? element : [element];

    // populate the element correctly
    for(var e = 0; e < elements.length; e++) {
      // grab the element
      var element = elements[e];
      // skip undefined elements or function objects (IE only)
      if(!element || typeof element == 'undefined' ||
          typeof element == 'function') {
        continue;
      }

      // anything else, process
      switch(element.type || element.tagName) {
        case 'radio':
          // use the single value to check the radio button
          element.checked = (element.value != '' && value.toString() == element.value);

        case 'checkbox':
          // depends on the value.
          // if it's an array, perform a sub loop
          // if it's a value, just do the check


          var values = value.constructor == Array ? value : [value];
          for(var j = 0; j < values.length; j++) {
            element.checked |= element.value == values[j];
          }

          //element.checked = (element.value != '' && value.toString().toLowerCase() == element.value.toLowerCase());
          break;

        case 'select-multiple':
          var values = value.constructor == Array ? value : [value];
          for(var i = 0; i < element.options.length; i++) {
            for(var j = 0; j < values.length; j++) {
              element.options[i].selected |= element.options[i].value == values[j];
            }
          }
          break;

        case 'select':
        case 'select-one':
          // if the select box has been replaced by this
          // selectbox plugin: https://gist.github.com/1139558
          if ($('#' + element.id + '_container').length > 0) {
            // Click the correct li to set the select box.
            $('li#' + element.id + '_input_' + value).click()
          // Otherwise just let it work the usual way.
          } else {
            element.value = value.toString() || value;
          }
          break;

        case 'text':
        case 'button':
        case 'textarea':
        case 'submit':
        default:
          value			= value == null ? '' : value;
          element.value	= value;

      }

    }

  }



  // ------------------------------------------------------------------------------------------
  // options & setup

  // exit if no data object supplied
  if (obj === undefined) {
    return this;
  };

  // options
  var options = jQuery.extend({
    phpNaming:			true,
      phpIndices:			false,
      resetForm:			true,
      identifier:			'id',
      debug:				false
  }, options);

  if(options.phpIndices) {
    options.phpNaming = true;
  }

  // ------------------------------------------------------------------------------------------
  // convert hierarchical JSON to flat array

  var arr	= [];
  parseJSON(obj);

  if(options.debug) {
    _populate = {
      arr:		arr,
      obj:		obj,
      elements:	[]
    }
  }

  // ------------------------------------------------------------------------------------------
  // main process function

  this.each(function(){
    // variables
    var tagName	= this.tagName.toLowerCase();
    var method	= tagName == 'form' ? populateFormElement : populateElement;

    // reset form?
    if(tagName == 'form' && options.resetForm) {
      this.reset();
    }

    // update elements
    for(var i in arr) {
      if (arr.hasOwnProperty(i)) {
        method(this, i, arr[i]);
      }
    }
  });

  return this;
};

moment.locale('zh-CN');


function ReplaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n= yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
}
