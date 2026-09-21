import $ from 'jquery';

export const jQueryLabels = thisElem => {
    $(document).on('focusin', '.form-control', function () {
        var getEle = $(this).prop('tagName');
        if (getEle === 'INPUT' || getEle === 'TEXTAREA') {
            var gatPlaceholder = $(this).attr('placeholder');
            if ((typeof gatPlaceholder !== 'undefined') && gatPlaceholder !== '') {
                $(this).parent().addClass("hasdata");
            }

            $(this).on('focusout', function () {
                if ($(this).val() === '') {
                    $(this).parent().removeClass("hasdata");
                }
            })
        }
        if (getEle === 'SELECT') {
            $(this).on('change', function () {
                var Slabel = $(this).find('option:selected').attr('label');
                if (typeof Slabel === 'undefined') {
                    $(this).parent().addClass("hasdata");
                } else {
                    $(this).parent().removeClass("hasdata");
                }
            });
        }
    })

    // $(document).on('focusin', '.ant-input:not(.multi)', function () {
    $(document).on('focusin', '.ant-input', function () {
        var getEle = $(this).prop('tagName');
        if (getEle === 'INPUT' || getEle === 'TEXTAREA') {
            $(this).parents('.antInputItem').addClass("hasdata");
            $(this).on('focusout', function () {
                if ($(this).val() === '') {
                    $(this).parents('.antInputItem').removeClass("hasdata");
                }
            })
        }
    })

    $(document).on('focusin', '.ant-picker', function () {
        var getEle = $(this).find('input');
        if (getEle.val() !== '') {
            $(this).parents('.antInputItem').addClass("hasdata");
        }
    })

    $(document).on('focusin', '.ant-select', function () {
        $(this).parent().addClass("hasdata");
        $(this).parents('.antSelectItem').addClass("hasdata");

        $(this).on('focusout', function () {
            if (($(this).hasClass('ant-select-open')) || ($(this).parents(".antSelectItem").next().hasClass("ant-form-item-has-success"))) {
                $(this).parent().removeClass("hasdata");
                $(this).parents('.antSelectItem').removeClass("hasdata");
            }

            if ($(this).find(".ant-select-selector").text() !== '') {
                $(this).parent().addClass("hasdata");
                $(this).parents('.antSelectItem').addClass("hasdata");
            }
        })
    })

    $(document).on('keyup', 'input[type=text].ant-input, input[type=text].form-control, textarea.form-control, textarea.ant-input, .ant-select-selection-search-input', function () {
        $(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
    });
}

export const calendarTableHover = () => {
    var max = 0;
    $('#checkavail-righttable thead th').each(function () {
        max = Math.max($(this).height(), max);
    }).height(max);

    //apply right slick table height to left static table
    $('#checkavail-righttable thead th').each(function (i, el) {
        var hgt = $(this).height();
        $('#checkavail-lefttable thead th').eq(i).height(hgt);
    });

    //equal table heights of both
    const leftTableHgt = $('#checkavail-lefttable').height();
    $('.slick-slide').height(leftTableHgt);
    $('.slick-slide').each(function () {
        $(this).find('.table-responsive').height(leftTableHgt);
        $(this).find('table.table').height(leftTableHgt);
        // $(this).find('.table-responsive').removeClass('table-responsive');
    });

    //match left table td and apply it to right table td
    $('#checkavail-lefttable tbody tr').each(function (i, el) {
        const inhgt = $(this).find('td.timecell').innerHeight();
        const incIndex = i + 1;
        $('#checkavail-righttable tbody tr:nth-child(' + incIndex + ')').children('td').innerHeight(inhgt + 'px');
        // setTimeout(function () {
        //     $('#checkavail-righttable tbody tr:nth-child(' + incIndex + ')').children('td').innerHeight(inhgt + 'px');
        // }, 1000);
    });
}