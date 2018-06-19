// Add help panel at right side of notebook window

define([
    'require',
    'jqueryui',
    'base/js/namespace',
    'base/js/events',
], function (
    requirejs,
    $,
    IPython,
    events
) {
    'use strict';

    /**
     * try to get bootstrap tooltip plugin.
     * The require call may fail, since the plugin doesn't seem to be included
     * in all Jupyter versions. In this case, we fallback to using jqueryui tooltips.
     */
    var have_bs_tooltips = false;
    requirejs(
        ['components/bootstrap/js/tooltip'],
        // we don't actually need to do anything with the return
        // just ensure that the plugin gets loaded.
        function () { have_bs_tooltips = true; },
        // The errback, error callback
        // The error has a list of modules that failed
        function (err) {
            var failedId = err.requireModules && err.requireModules[0];
            if (failedId === 'components/bootstrap/js/tooltip') {
                // could do something here, like load a cdn version.
                // For now, just ignore it.
                have_bs_tooltips = false;
            }
        }
    );

    // define default values for config parameters
    var params = {
        help_panel_add_toolbar_button: true
    };

    // update params with any specified in the server's config file
    function update_params () {
        var config = IPython.notebook.config;
        for (var key in params) {
            if (config.data.hasOwnProperty(key))
                params[key] = config.data[key];
        }
    }

    var initialize = function () {
        update_params();
        if (params.help_panel_add_toolbar_button) {
            $(IPython.toolbar.add_buttons_group([
                IPython.keyboard_manager.actions.register({
                    help   : 'Show help panel',
                    icon   : 'fa-book',
                    handler: function() {
                        var visible = toggleHelpPanel();
                        var btn = $(this);
                        setTimeout(function() { btn.blur(); }, 500);
                    }
                }, 'show-help-panel', 'help_panel'),
            ])).find('.btn').attr({
                id: 'btn_help_panel',
                'data-toggle': 'button',
                'aria-pressed': 'false'
            });
        }
    };

    var side_panel_min_rel_width = 10;
    var side_panel_max_rel_width = 90;
    var side_panel_start_width = 45;

    var build_side_panel = function (main_panel, side_panel, min_rel_width, max_rel_width) {
        if (min_rel_width === undefined) min_rel_width = 0;
        if (max_rel_width === undefined) max_rel_width = 100;

        side_panel.css('display','none');
        side_panel.insertAfter(main_panel);

        var side_panel_splitbar = $('<div class="side_panel_splitbar"/>');
        var side_panel_inner = $('<div class="side_panel_inner"/>');
        var side_panel_expand_contract = $('<i class="btn fa fa-expand hidden-print">');
        side_panel.append(side_panel_splitbar);
        side_panel.append(side_panel_inner);
        side_panel_inner.append(side_panel_expand_contract);

        side_panel_expand_contract.attr({
            title: 'expand/contract panel',
            'data-toggle': 'tooltip'
        }).tooltip({
            placement: 'right'
        }).click(function () {
            var open = $(this).hasClass('fa-expand');
            var site = $('#site');
            slide_side_panel(main_panel, side_panel,
                open ? 100 : side_panel.data('last_width') || side_panel_start_width);
            $(this).toggleClass('fa-expand', !open).toggleClass('fa-compress', open);

            var tooltip_text = (open ? 'shrink to not' : 'expand to') + ' fill the window';
            if (open) {
                side_panel.insertAfter(site);
                site.slideUp();
                $('#header').slideUp();
                side_panel_inner.css({'margin-left': 0});
                side_panel_splitbar.hide();
            }
            else {
                side_panel.insertAfter(main_panel);
                $('#header').slideDown();
                site.slideDown({
                    complete: function() { events.trigger('resize-header.Page'); }
                });
                side_panel_inner.css({'margin-left': ''});
                side_panel_splitbar.show();
            }

            if (have_bs_tooltips) {
                side_panel_expand_contract.attr('title', tooltip_text);
                side_panel_expand_contract.tooltip('hide').tooltip('fixTitle');
            }
            else {
                side_panel_expand_contract.tooltip('option', 'content', tooltip_text);
            }
        });

        // bind events for resizing side panel
        side_panel_splitbar.mousedown(function (md_evt) {
            md_evt.preventDefault();
            $(document).mousemove(function (mm_evt) {
                mm_evt.preventDefault();
                var pix_w = side_panel.offset().left + side_panel.outerWidth() - mm_evt.pageX;
                var rel_w = 100 * (pix_w) / side_panel.parent().width();
                rel_w = rel_w > min_rel_width ? rel_w : min_rel_width;
                rel_w = rel_w < max_rel_width ? rel_w : max_rel_width;
                main_panel.css('width', (100 - rel_w) + '%');
                side_panel.css('width', rel_w + '%').data('last_width', rel_w);
            });
            return false;
        });
        $(document).mouseup(function (mu_evt) {
            $(document).unbind('mousemove');
        });

        return side_panel;
    };

    var slide_side_panel = function (main_panel, side_panel, desired_width) {

        var anim_opts = {
            step : function (now, tween) {
                main_panel.css('width', 100 - now + '%');
            }
        };

        if (desired_width === undefined) {
            if (side_panel.is(':hidden')) {
                desired_width = (side_panel.data('last_width') || side_panel_start_width);
            }
            else {
                desired_width = 0;
            }
        }

        var visible = desired_width > 0;
        if (visible) {
            main_panel.css({float: 'left', 'overflow-x': 'auto'});
            side_panel.show();
        }
        else {
            anim_opts['complete'] = function () {
                side_panel.hide();
                main_panel.css({float : '', 'overflow-x': '', width: ''});
            };
        }

        side_panel.animate({width: desired_width + '%'}, anim_opts);
        return visible;
    };
    
    var populate_side_panel = function(side_panel) {
        var side_panel_inner = side_panel.find('.side_panel_inner');
        var button = $(`<input type="button" value="Apply"/>`)
                         .on("click", function()
                         {
                             console.log("Saving Metadata");
                             // Writing the metadata
                             Jupyter.notebook.metadata['info']['Grade'] = $('input#Grade').val();
                             Jupyter.notebook.metadata['info']['Subject'] = $('input#Subject').val();
                             Jupyter.notebook.metadata['info']['Summary'] = $('textarea#Summary').val();
                             // Saving
                             Jupyter.notebook.save_checkpoint();
                         });
        
        var add_to = $(`<div id="form_testing">
                            <p id="StoreGrade" hidden></p>
                            <p id="StoreSubject" hidden></p>
                            <p id="StoreSummary" hidden></p>
                            </div>`).append(`
                            <form>
                                Grade: &nbsp;&nbsp;&nbsp;&nbsp; <input type="text" id="Grade" value="`+Jupyter.notebook.metadata['info']['Grade']+`"><br>
                                Subject: &nbsp;&nbsp; <input type="text" id="Subject" value="`+Jupyter.notebook.metadata['info']['Subject']+`"><br><br>
                                Summary: <textarea id="Summary" cols="50" rows="10">`+Jupyter.notebook.metadata['info']['Summary']+`</textarea><br>
                                <!--<input type="button" value="Apply" onclick="UpdateMeta();"/>-->
                            </form>`).append(button);
                        //</div>`);
        
        //var button = $('<button type="button" onclick="UpdateMeta">Apply Changes</button>');
        
        // Not needed anymore
        /*var script = $(function () {
                        $('<script>')
                            .attr('type', 'text/javascript')
                            .text(`function UpdateMeta()
                                   {
                                       var grade = document.getElementById("Grade").value;
                                       var subject = document.getElementById("Subject").value;
                                       var summary = document.getElementById("Summary").value;
                                       
                                       document.getElementById("StoreGrade").value = grade;
                                       document.getElementById("StoreSubject").value = subject;
                                       document.getElementById("StoreSummary").value = summary;
                                       
                                       //alert(document.getElementById("StoreGrade").value);
                                       //alert(document.getElementById("StoreSubject").value);
                                       //alert(document.getElementById("StoreSummary").value);
                                   }`)
                            .appendTo(side_panel_inner);
                     });*/
        
        side_panel_inner.append( '<p>Test</p>' ).append(add_to);
        //var form = $('<form></form>');
        //$form.append('<input type="button" value="button">').appendTo(side_panel.find('.side_panel_inner'));
        //form.appendTo(side_panel.find('.side_panel_inner'));
    };//*/
/*
    var populate_side_panel = function(side_panel) {
        var side_panel_inner = side_panel.find('.side_panel_inner');
        var add_to = $(`<div id="form_testing">
                            <p id="StoreGrade" hidden></p>
                            <p id="StoreSubject" hidden></p>
                            <p id="StoreSummary" hidden></p>
                            <form>
                                Grade &nbsp;: <input type="text" id="Grade" value="`+Jupyter.notebook.metadata['info']['Grade']+`"><br>
                                Subject: <input type="text" id="Subject" value="`+Jupyter.notebook.metadata['info']['Subject']+`"><br>
                                Subject: <textarea id="Summary" cols="50" rows="10">`+Jupyter.notebook.metadata['info']['Summary']+`</textarea><br>
                                <input type="button" value="Apply" onclick="UpdateMeta();"/>
                            </form>
                        </div>`);
        
        //var button = $('<button type="button" onclick="UpdateMeta">Apply Changes</button>');
        var script = $(function () {
                        $('<script>')
                            .attr('type', 'text/javascript')
                            .text(`function UpdateMeta()
                                   {
                                       var grade = document.getElementById("Grade").value;
                                       var subject = document.getElementById("Subject").value;
                                       var summary = document.getElementById("Summary").value;
                                       
                                       document.getElementById("StoreGrade").value = grade;
                                       document.getElementById("StoreSubject").value = subject;
                                       document.getElementById("StoreSummary").value = summary;
                                       
                                       //alert(document.getElementById("StoreGrade").value);
                                       //alert(document.getElementById("StoreSubject").value);
                                       //alert(document.getElementById("StoreSummary").value);
                                   }`)
                            .appendTo(side_panel_inner);
                     });
        side_panel_inner.append( '<p>Test</p>' ).append(add_to);
        //var form = $('<form></form>');
        //$form.append('<input type="button" value="button">').appendTo(side_panel.find('.side_panel_inner'));
        //form.appendTo(side_panel.find('.side_panel_inner'));
    };/*
        var side_panel_inner = side_panel.find('.side_panel_inner');
        var qh = IPython.quick_help;
        console.log(qh);
        var strip_modal = function(into) {
            // strip qh modal, insert content into element 'into'
            $('.quickhelp').closest('.modal-body').children().children().appendTo(into);
        };

        if ($('.quickhelp').length > 0) {
            strip_modal(side_panel_inner);
        }
        else {
            // ensure quickhelp shortcuts modal won't show
            $('body').addClass('help_panel_hide');
            // get quickhelp to show shortcuts
            qh.show_keyboard_shortcuts();
            // attach handler for qh showing shortcuts
            var qh_dia = $(qh.shortcut_dialog);
            qh_dia.on('shown.bs.modal', function(evt) {
                strip_modal(side_panel_inner);
                // delicately pretend that it was never shown, unbind handlers
                qh_dia.on('hidden.bs.modal', function () {
                    $('body').removeClass('help_panel_hide');
                    qh_dia.off('hidden.bs.modal');
                }).off('shown.bs.modal').modal("hide");
            });
        }
        // make sure content we stripped will be rebuilt
        //qh.force_rebuild = true;
    };//*/

    var toggleHelpPanel = function () {
        var main_panel = $('#notebook_panel');
        var side_panel = $('#side_panel');

        var side_panel_inner = side_panel.find('.side_panel_inner');
        //Jupyter.notebook.metadata['info'] = {'Grade': '', 'Subject': '', 'Summary': ''};
        //Jupyter.notebook.metadata['info']['Grade'] = $('input[name=Grade]');
        //Jupyter.notebook.metadata['info']['Subject'] = $('input[name=Subject]');
        //Jupyter.notebook.metadata['info']['Summary'] = $('textarea[name=Summary]');
        
        Jupyter.notebook.keyboard_manager.disable();
        //Jupyter.notebook.metadata['info'] = {'Grade': '', 'Subject': '', 'Summary': ''};
        //console.log(Jupyter.notebook.metadata);
        
        if (side_panel.length < 1) {
            if(!('info' in Jupyter.notebook.metadata))
            {
                Jupyter.notebook.metadata['info'] = {'Grade': '', 'Subject': '', 'Summary': ''};
            }
            side_panel = $('<div id="side_panel"/>');
            build_side_panel(main_panel, side_panel,
                side_panel_min_rel_width, side_panel_max_rel_width);
            populate_side_panel(side_panel);
        }
        else
        {
            //alert("Saving");
            //Jupyter.notebook.metadata['info']['Grade'] = $('p#StoreGrade').val();
            //Jupyter.notebook.metadata['info']['Subject'] = $('p#StoreSubject').val();
            //Jupyter.notebook.metadata['info']['Summary'] = $('p#StoreSummary').val();
            
            // Done elsewhere
            // Writing the metadata
            //Jupyter.notebook.metadata['info']['Grade'] = $('input#Grade').val();
            //Jupyter.notebook.metadata['info']['Subject'] = $('input#Subject').val();
            //Jupyter.notebook.metadata['info']['Summary'] = $('textarea#Summary').val();
            // Saving
            //Jupyter.notebook.save_checkpoint();
        }

        var visible = slide_side_panel(main_panel, side_panel);
        if (params.help_panel_add_toolbar_button) {
            $('#btn_help_panel').toggleClass('active', visible);
        }
        return visible;
    };

    var load_ipython_extension = function () {
        $('head').append(
            $('<link/>', {
                rel: 'stylesheet',
                type:'text/css',
                href: requirejs.toUrl('./help_panel.css')
            })
        );
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension : load_ipython_extension
    };
});
