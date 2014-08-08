/// <reference path="../../js/jquery.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseRight = require("../coreplayer-shared-module/rightPanel");
import utils = require("../../utils");
import conditions = require("../wellcomeplayer-dialogues-module/conditionsDialogue");
import IWellcomeProvider = require("../wellcomeplayer-shared-module/iWellcomeProvider");

export class MoreInfoRightPanel extends baseRight.RightPanel {

    moreInfoItemTemplate: JQuery;
    $items: JQuery;
    $conditionsLink: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoRightPanel');

        super.create();

        this.moreInfoItemTemplate = $('<div class="item">\
                                           <div class="header"></div>\
                                           <div class="text"></div>\
                                       </div>');

        this.$items = $('<div class="items"></div>');
        this.$main.append(this.$items);
    }

    toggleComplete(): void {
        super.toggleComplete();

        if (this.isUnopened) {
            this.getInfo();
        }
    }

    getInfo(): void {

        // show loading icon.
        this.$main.addClass('loading');

        // if data already loaded.
        if ((<IWellcomeProvider>this.provider).moreInfo){
            this.displayInfo();
        } else {
            // otherwise, load data.
            var uri = (<IWellcomeProvider>this.provider).getMoreInfoUri();

            $.getJSON(uri, (data: any) => {
                (<IWellcomeProvider>this.provider).moreInfo = data;

                this.displayInfo();
            });
        }
    }

    displayInfo(): void {
        this.$main.removeClass('loading');

        this.$items.empty();

        //data.Summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec hendrerit rutrum tortor at semper. Proin vel nulla eget risus gravida consectetur at at quam. Ut ac quam purus, eget sodales enim. Nam faucibus adipiscing massa, quis vehicula lacus eleifend non. Curabitur semper hendrerit rutrum. In semper augue a sapien iaculis ac suscipit lorem semper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc venenatis cursus massa, vel condimentum augue blandit sit amet. Ut vel magna eu dui vulputate facilisis. Aenean urna neque, consequat quis cursus sit amet, lobortis in tellus.";

        var data = (<IWellcomeProvider>this.provider).moreInfo;

        $.each(data, (key: string, value: string) => {
            if (value && !value.startsWith('http:')) {
                switch (key.toLowerCase()) {
                    case "bibdoctype":
                        break;
                    case "marc759a":
                        break;
                    case "marc905a":
                        break;
                    case "institution":
                        break;
                    case "repositorylogo":
                        break;
                    default:
                        this.$items.append(this.buildItem(
                            {
                                "label": key,
                                "value": value
                            },
                            130));
                        break;
                }
            }
        });

        // logo
        var logoUri = data["RepositoryLogo"];

        if (logoUri) {
            this.$items.append('<img src="' + logoUri + '" />');
        }

        // full catalogue record.
        var catalogueRecordKey = "View full catalogue record";
        var url = data[catalogueRecordKey];

        if (url) {
            var $catalogueLink = $('<a href="' + url + '" target="_blank" class="action catalogue">' + catalogueRecordKey + '</a>');
            this.$items.append($catalogueLink);
        }

        // conditions.
        var $conditionsLink = $('<a href="#" class="action conditions">' + this.content.conditions + '</a>');
        this.$items.append($conditionsLink);

        $conditionsLink.on('click', (e) => {
            e.preventDefault();
            $.publish(conditions.ConditionsDialogue.SHOW_CONDITIONS_DIALOGUE);
        });
    }

    buildItem(item: any, trimChars: number): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        item = _.values(item);

        var name = item[0];
        var value = item[1];

        // replace \n with <br>
        value = value.replace('\n', '<br>');

        $header.text(name);
        $text.text(value);

        $text.toggleExpandText(trimChars);

        return $elem;
    }

    resize(): void {
        super.resize();

    }
}
