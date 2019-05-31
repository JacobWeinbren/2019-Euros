//Colours of Political Parties
colours = {
    "C": "#0087DC",
    "DUP": "#D46A4C",
    "Green": "#6AB023",
    "Ind": "#939393",
    "UKIP": "#70147A",
    "Other": "#939393",
    "SDLP": "#3A9E84",
    "Lab": "#DC241f",
    "LD": "#FAA61A",
    "PC": "#008142",
    "SF": "#326760",
    "SNP": "#FEF987",
    "Brex": "#12B6CF",
    "CHUK": "#999999",
    "Alliance": "#F6CB2F",
    "Leave": "#0069b5",
    "Remain": "#febf10"
}

parties = {
    "C": "Conservative",
    "DUP": "Democratic Unionist Party",
    "Green": "Green Party",
    "Ind": "Independent",
    "Lab": "Labour",
    "LD": "Liberal Democrats",
    "PC": "Plaid Cymru",
    "SF": "Sinn Fein",
    "SNP": "SNP",
    "Brex": "Brexit Party",
    "CHUK": "Independent Party",
    "SDLP": "SDLP",
    "Alliance": "Alliance",
    "Leave": "Leave",
    "Remain": "Remain"
}

function objectKeyByValue(obj, val) {
    return Object.entries(obj).find(i => i[1] === val);
}

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

$('.map')[0].addEventListener('load', function() {
    map = svgPanZoom('.map', {
        minZoom: 1,
        maxZoom: 1
    });
    map.zoom(1)
});

$.ajax({
    url: "data/euros.csv",
    async: false,
    success: function(data) {
        euros_data = $.csv.toArrays(data);
    }
})

$.ajax({
    url: "data/elections.csv",
    async: false,
    success: function(data) {
        elections_data = $.csv.toArrays(data);
    }
})

$.ajax({
    url: "data/leave.csv",
    async: false,
    success: function(data) {
        leave_data = $.csv.toArrays(data);
    }
})

function ui(element) {
    element.hover(function() {
        if ($(this).hasClass('location')) {
            election = $(this).attr('election')
            if (election != 'lvote' && election != 'gvote') {
                $(this).css('opacity', '0.5')
            } else {
                $(this).css('fill-opacity', 1)
            }
            $('#a').text($(this).attr('title'))
            if (election == 'lvote') {
                $('#b').html(($(this).attr('amount') * 100).toFixed(1) + '% of 2017 Labour Vote' + '<br><br><b class="meta">Labour 2017:</b> ' + parseFloat($(this).attr('a')).toFixed(1) + '%' + '<br><b class="meta">Labour 2019:</b> ' + parseFloat($(this).attr('b')).toFixed(1) + '%')
            }
            if (election == 'gvote') {
                $('#b').text(($(this).attr('amount') * 1).toFixed(1) + ' % Change Green Party')
            }
            if (election == 'eu2019s') {
                if ($(this).attr('party') == $(this).attr('party17')) {
                    $('#b').html('<span class="first">' + parties[$(this).attr('party')] + '</span> hold')
                } else {
                    $('#b').html('<span class="first">' + parties[$(this).attr('party')] + '</span> gain from <span class="second">' + parties[$(this).attr('party17')] + '</span>')
                }
                $('.first').css('color', colours[$(this).attr('party')])
                $('.second').css('color', colours[$(this).attr('party17')])
            }
            if (election == 'eu2019' || election == 'eu2016') {
                $('#b').text(parties[$(this).attr('party')])
            }
            table = $('#t-results')
            $('#hex').css('color', colours[$(this).attr('party')])
            if (election != 'lvote') {
                $('#chart').html('')
                $('#chart').css('background', 'white')
                results = JSON.parse("[" + $(this).attr('results') + "]");
                $("#t-results").html('')
                if (election == 'eu2019' || election == 'eu2019s') {
                    results = {
                        "Brex": results[0],
                        "CHUK": results[1],
                        "C": results[2],
                        "Green": results[3],
                        "Lab": results[4],
                        "LD": results[5],
                        "Other": results[6],
                        "PC": results[7],
                        "SNP": results[8],
                        "UKIP": results[9]
                    }
                    $(table).append('<tr><th>Party</th><th>Vote Share (%)</th></tr>')

                }
                if (election == 'eu2016') {
                    results = {
                        "Leave": results[0],
                        "Remain": results[1]
                    }
                    $(table).append('<tr><th>Referendum Campaign</th><th>Vote Share (%)</th></tr>')
                }


                total = 0

                for (party in results) {
                    if (results[party] < 0.05) {
                        delete results[party]
                    } else {
                        results[party] = results[party] * 100
                        results[party] = results[party].toFixed(2);
                        total += parseInt(results[party])

                    }
                }

                sorted = Object.values(results).sort(function(a, b) {
                    return b - a
                })

                for (i = 0; i < sorted.length; i++) {
                    party = objectKeyByValue(results, sorted[i]);
                    if (party[0] in parties) {
                        $(table).append('<tr><td>' + parties[party[0]] + '</td><td>' + party[1] + '</th></tr>')
                    } else {
                        $(table).append('<tr><td>' + 'Misc' + '</td><td>' + party[1] + '</th></tr>')
                    }
                    div = $("<div background></div>")
                    div.css('background-color', colours[party[0]])
                    div.css('width', Math.round(party[1] / total * 300))
                    $('#chart').append(div)
                }

                total = 0
                parts = 0
                $('#chart').children('div').each(function() {
                    total += parseInt($(this).css('width'))
                    parts += 1
                })
                difference = (300 - total) / parts
                $('#chart').children('div').each(function() {
                    $(this).css('width', parseInt($(this).css('width')) + difference)
                })
            }

        }
    }, function() {
        $("#t-results").html('')
        election = $(this).attr('election')
        $('#chart').html('')
        $('#chart').css('background', 'lightgrey')
        if (election != 'lvote') {
            if (election == 'gvote') {
                $(this).css('fill-opacity', $(this).attr('amount') / 100 * 5)
            }
            $(this).css('opacity', '1')
        } else {
            $(this).css('fill-opacity', $(this).attr('amount'))
        }
        $('#a').text('Constituency Name')
        if (election == 'lvote') {
            $('#b').html('% of 2017 Labour Vote' + '<br><br><b class="meta">Labour 2017:</b> ' + 0 + '%' + '<br><b class="meta">Labour 2019:</b> ' + 0 + '%')
        }
        if (election == 'eu2019s') {
            $('#b').text('Party (2019) gain from Party (2017)')
        }
        if (election == 'eu2019') {
            $('#b').text('Constituency Party')
        }
        $('#hex').css('color', 'lightgrey')
    });
}