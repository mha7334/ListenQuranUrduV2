"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_audio_1 = require("nativescript-audio");
var application_settings_1 = require("application-settings");
var application_1 = require("application");
//check it again
application_1.on(application_1.launchEvent, function (args) {
    //
});
//check it again
application_1.on(application_1.suspendEvent, function (args) {
    if (!this._player.isAudioPlaying) {
        this._player.pause();
    }
});
var HomeComponent = /** @class */ (function () {
    function HomeComponent() {
        this.urduLink = 'http://www.qurandownload.com/listen-to-quran-in-your-language/urdu-translation/001.mp3';
        this.currentSura = "<no sura selected>";
        this.duration = "0";
        this.showPlaying = true;
        this.showLoop = false;
        this.totalDuration = "0";
        this.totalMilliSecs = 0;
        this.suras = [];
        for (var i = 0; i < suraList.length; i++) {
            this.suras.push(new Sura(suraList[i]));
        }
        var n_str = "001";
        if (application_settings_1.hasKey("suraNumber")) {
            n_str = application_settings_1.getString("suraNumber");
        }
        var n;
        n = n_str;
        this.currentSura = n_str + ":" + suraList[n - 1];
        if (application_settings_1.hasKey("totalDuration")) {
            this.totalDuration = application_settings_1.getString("totalDuration");
        }
        this._player = new nativescript_audio_1.TNSPlayer();
    }
    HomeComponent.prototype._trackComplete = function (args) {
        console.log('reference back to player:', args.player);
        if (this.showLoop) {
            this.nextPlay(this.currentSura);
        }
        else {
            this._player.seekTo(0);
            this.showPlaying = true;
        }
    };
    HomeComponent.prototype._trackError = function (args) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);
        alert("Error:" + args.error);
        // Android only: extra detail on error
        console.log('extra info on the error:', args.extra);
    };
    HomeComponent.prototype.togglePlay = function () {
        console.log(this._player);
        if (this._player == undefined && this.showPlaying) {
            var n = this.currentSura.split(":")[0].trim();
            var n_str = this.prefixNbr(n);
            this.playAudio(n_str);
            this.showPlaying = false;
            this.duration = "0";
            //this.totalDuration = getString("currentTotalDuration");
        }
        else if (this.showPlaying) {
            this.showPlaying = false;
            this._player.play();
            this.duration = "0";
            //this.totalDuration = getString("currentTotalDuration");
        }
        else {
            this.showPlaying = true;
            this._player.pause();
            application_settings_1.setNumber("currentTime", this._player.currentTime);
        }
    };
    HomeComponent.prototype.nextPlay = function (args) {
        var n = args.split(":")[0].trim();
        n++;
        if (n > 114) {
            return;
        }
        var n_str = this.prefixNbr(n);
        this._player.dispose().then(function (disposed) {
            console.log("IsDisposed:", disposed);
        });
        this.playAudio(n_str);
        this.duration = "0";
        //this.totalDuration = getString("currentTotalDuration");     
        this.showPlaying = false;
        this.currentSura = n_str + ":" + suraList[n - 1]; //index 0  
    };
    HomeComponent.prototype.prevPlay = function (args) {
        var n = args.split(":")[0].trim();
        n--;
        if (n < 1) {
            return;
        }
        var n_str = this.prefixNbr(n); //attach 0 fx. 001 or 010
        this.currentSura = n_str + ":" + suraList[n - 1]; //index 0   
        this._player.dispose().then(function (disposed) {
            console.log("IsDisposed:", disposed);
        });
        this.playAudio(n_str);
        this.showPlaying = false;
        this.duration = "0";
        //this.totalDuration = getString("currentTotalDuration");
    };
    HomeComponent.prototype.onItemTap = function (args) {
        var _this = this;
        var n;
        n = args.index;
        n = n == undefined ? args : n;
        n++;
        var n_str = this.prefixNbr(n);
        this.currentSura = n_str + ":" + suraList[args.index];
        this.playAudio(n_str);
        this.showPlaying = false;
        //this.duration = "0";
        setTimeout(function (x) {
            console.log(application_settings_1.getString("totalDuration"));
            _this.totalDuration = application_settings_1.getString("totalDuration");
        }, 4000);
        this.timeout(10);
    };
    HomeComponent.prototype.timeout = function (times) {
        var theLoop = function (i, delay) {
            if (delay === void 0) { delay = 3000; }
            if (i % 2 === 0) {
                delay = 1500;
            }
            setTimeout(function () {
                if (--i) {
                    theLoop(i);
                    console.log(i);
                }
            }, delay);
        };
        theLoop(10);
    };
    HomeComponent.prototype.playAudio = function (n_str) {
        var _this = this;
        console.log("*****************");
        var n;
        application_settings_1.setString("suraNumber", n_str);
        this._player.initFromUrl({
            audioFile: 'http://www.qurandownload.com/listen-to-quran-in-your-language/urdu-translation/' + n_str + '.mp3',
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        }).then(function () {
            _this._player.play().then(function (playing) {
                console.log("Playing:", playing);
            });
        }).then(function () {
            _this._player.getAudioTrackDuration().then(function (duration) {
                application_settings_1.setString("totalDuration", _this.millisToMinutesAndSeconds(duration));
            });
        });
    };
    HomeComponent.prototype.millisToMinutesAndSeconds = function (millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        var result = minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
        return result;
    };
    HomeComponent.prototype.prefixNbr = function (n) {
        var n_str = n.toString();
        if (n.toString().length == 1) {
            n_str = "00" + n.toString();
        }
        else if (n.toString().length == 2) {
            n_str = "0" + n.toString();
        }
        else {
            n_str = n.toString();
        }
        return n_str;
    };
    HomeComponent.prototype.loopAll = function () {
        this.showLoop = !this.showLoop ? true : false;
    };
    HomeComponent.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    HomeComponent.prototype.ngOnInit = function () {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for the view.
        *************************************************************/
        //this.totalDuration = "0";
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: "Home",
            moduleId: module.id,
            templateUrl: "./home.component.html",
            changeDetection: core_1.ChangeDetectionStrategy.Default
        }),
        __metadata("design:paramtypes", [])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//internal class
var Sura = /** @class */ (function () {
    function Sura(name) {
        this.name = name;
    }
    return Sura;
}());
//names of all suras'
var suraList = [
    "Al-Fatihah (The Opening)",
    "Al-Baqarah (The Cow)",
    "Al-'Imran (The Family of Amran)",
    "An-Nisa' (The Women)",
    "Al-Ma'idah (The Food)",
    "Al-An'am (The Cattle)",
    "Al-A'raf (The Elevated Places)",
    "Al-Anfal (Voluntary Gifts)",
    "Al-Bara'at / At-Taubah(The Immunity)",
    "Yunus (Jonah)",
    "Hud (Hud)",
    "Yusuf (Joseph)",
    "Ar-Ra'd (The Thunder)",
    "Ibrahim (Abraham)",
    "Al-Hijr (The Rock)",
    "An-Nahl (The Bee)",
    "Bani Isra'il (The Israelites)",
    "Al-Kahf (The Cave)",
    "Maryam (Mary)",
    "Ta Ha (Ta Ha)",
    "Al-Anbiya' (The Prophets)",
    "Al-Hajj (The Pilgrimage)",
    "Al-Mu'minun (The Believers)",
    "An-Nur (The Light)",
    "Al-Furqan (The Discrimination)",
    "Ash-Shu'ara' (The Poets)",
    "An-Naml (The Naml)",
    "Al-Qasas (The Narrative)",
    "Al-'Ankabut (The Spider)",
    "Ar-Rum (The Romans)",
    "Luqman (Luqman)",
    "As-Sajdah (The Adoration)",
    "Al-Ahzab (The Allies)",
    "Al-Saba' (The Saba')",
    "Al-Fatir (The Originator)",
    "Ya Sin (Ya Sin)",
    "As-Saffat (Those Ranging in Ranks)",
    "Sad (Sad)",
    "Az-Zumar (The Companies)",
    "Al-Mu'min (The Believer)",
    "Ha Mim (Ha Mim)",
    "Ash-Shura (Counsel)",
    "Az-Zukhruf (Gold)",
    "Ad-Dukhan (The Drought)",
    "Al-Jathiyah (The Kneeling)",
    "Al-Ahqaf (The Sandhills)",
    "Muhammad (Muhammad)",
    "Al-Fath (The Victory)",
    "Al-Hujurat (The Apartments)",
    "Qaf (Qaf)",
    "Ad-Dhariyat (The Scatterers)",
    "At-Tur (The Mountain)",
    "An-Najm (The Star)",
    "Al-Qamar (The Moon)",
    "Ar-Rahman (The Beneficent)",
    "Al-Waqi'ah (The Event)",
    "Al-Hadid (Iron)",
    "Al-Mujadilah (The Pleading Woman)",
    "Al-Hashr (The Banishment)",
    "Al-Mumtahanah (The Woman who is Examined)",
    "As-Saff (The Ranks)",
    "Al-Jumu'ah (The Congregation)",
    "Al-Munafiqun (The Hypocrites)",
    "At-Taghabun (The Manifestation of Losses)",
    "At-Talaq (Divorce)",
    "At-Tahrim (The Prohibition)",
    "Al-Mulk (The Kingdom)",
    "Al-Qalam (The Pen)",
    "Al-Haqqah (The Sure Truth)",
    "Al-Ma'arij (The Ways of Ascent)",
    "Nuh (Noah)",
    "Al-Jinn (The Jinn)",
    "Al-Muzzammil (The One Covering Himself)",
    "Al-Muddaththir (The One Wrapping Himself Up)",
    "Al-Qiyamah (The Resurrection)",
    "Al-Insan (The Man)",
    "Al-Mursalat (Those Sent Forth)",
    "An-Naba' (The Announcement)",
    "An-Nazi'at (Those Who Yearn)",
    "'Abasa (He Frowned)",
    "At-Takwir (The Folding Up)",
    "Al-Infitar (The Cleaving)",
    "At-Tatfif (Default in Duty)",
    "Al-Inshiqaq (The Bursting Asunder)",
    "Al-Buruj (The Stars)",
    "At-Tariq (The Comer by Night)",
    "Al-A'la (The Most High)",
    "Al-Ghashiyah (The Overwhelming Event)",
    "Al-Fajr (The Daybreak)",
    "Al-Balad (The City)",
    "Ash-Shams (The Sun)",
    "Al-Lail (The Night)",
    "Ad-Duha (The Brightness of the Day)",
    "Al-Inshirah (The Expansion)",
    "At-Tin (The Fig)",
    "Al-'Alaq (The Clot)",
    "Al-Qadr (The Majesty)",
    "Al-Bayyinah (The Clear Evidence)",
    "Al-Zilzal (The Shaking)",
    "Al-'Adiyat (The Assaulters)",
    "Al-Qari'ah (The Calamity)",
    "At-Takathur (The Abundance of Wealth)",
    "Al-'Asr (The Time)",
    "Al-Humazah (The Slanderer)",
    "Al-Fil (The Elephant)",
    "Al-Quraish (The Quraish)",
    "Al-Ma'un (Acts of Kindness)",
    "Al-Kauthar (The Abundance of Good)",
    "Al-Kafirun (The Disbelievers)",
    "An-Nasr (The Help)",
    "Al-Lahab (The Flame)",
    "Al-Ikhlas (The Unity)",
    "Al-Falaq (The Dawn)",
    "An-Nas (The Men)"
];
//001-114
//http://www.qurandownload.com/listen-to-quran-in-your-language/urdu-translation/001.mp3 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNDQUEyRTtBQUMzRSx5REFBK0M7QUFFL0MsNkRBQXlHO0FBR3pHLDJDQUEwTDtBQUUxTCxnQkFBZ0I7QUFDaEIsZ0JBQWEsQ0FBQyx5QkFBVyxFQUFFLFVBQVUsSUFBMEI7SUFDN0QsRUFBRTtBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsZ0JBQWdCO0FBQ2hCLGdCQUFhLENBQUMsMEJBQVksRUFBRSxVQUFVLElBQTBCO0lBRTVELEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FDaEMsQ0FBQztRQUNHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBV0g7SUFZSTtRQVZBLGFBQVEsR0FBVyx3RkFBd0YsQ0FBQztRQUdyRyxnQkFBVyxHQUFHLG9CQUFvQixDQUFDO1FBQ25DLGFBQVEsR0FBRyxHQUFHLENBQUM7UUFDZixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1FBQzVCLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBSXRCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWhCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELElBQUksS0FBSyxHQUFRLEtBQUssQ0FBQztRQUN2QixF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SUFDN0IsdUJBQXVCO0lBQ3ZCLG9CQUFvQjtJQUNwQiw0QkFBNEI7SUFDNUIsaUNBQWlDO0lBQ2pDLFlBQVk7SUFDWixvQkFBb0I7SUFDcEIseUNBQXlDO0lBQ3pDLDhDQUE4QztJQUM5QywrQkFBK0I7SUFDL0Isb0JBQW9CO0lBQ3BCLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0IsOEJBQThCO0lBQzlCLHFCQUFxQjtJQUNyQiw0QkFBNEI7SUFDNUIsMkJBQTJCO0lBQzNCLDZCQUE2QjtJQUM3QixvQ0FBb0M7SUFDcEMsc0JBQXNCO0lBQ3RCLCtCQUErQjtJQUMvQix5QkFBeUI7SUFDekIsdUNBQXVDO0lBQ3ZDLHdCQUF3QjtJQUN4QixxQkFBcUI7SUFDckIscUJBQXFCO0lBQ3JCLHFCQUFxQjtJQUNyQixxQ0FBcUM7SUFDckMsNkJBQTZCO0lBQzdCLGtCQUFrQjtJQUNsQixxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLGtDQUFrQztJQUNsQyx5QkFBeUI7SUFDekIsNkJBQTZCO0lBQzdCLDJCQUEyQjtJQUMzQix1Q0FBdUM7SUFDdkMsb0JBQW9CO0lBQ3BCLDRCQUE0QjtJQUM1Qix1QkFBdUI7SUFDdkIsMEJBQTBCO0lBQzFCLDZCQUE2QjtJQUM3QixvQ0FBb0M7SUFDcEMsK0JBQStCO0lBQy9CLG9CQUFvQjtJQUNwQixzQkFBc0I7SUFDdEIsdUJBQXVCO0lBQ3ZCLHFCQUFxQjtJQUNyQixrQkFBa0I7Q0FDakIsQ0FBQztBQUlGLFNBQVM7QUFDVCx3RkFBd0YiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgVE5TUGxheWVyIH0gZnJvbSAnbmF0aXZlc2NyaXB0LWF1ZGlvJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tIFwidWkvbGFiZWxcIjtcclxuaW1wb3J0IHsgZ2V0TnVtYmVyLCBzZXROdW1iZXIsIGdldFN0cmluZywgc2V0U3RyaW5nLCBoYXNLZXksIHJlbW92ZSwgY2xlYXIgfSBmcm9tIFwiYXBwbGljYXRpb24tc2V0dGluZ3NcIjtcclxuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7IFxyXG5pbXBvcnQgeyBrbm93bkZvbGRlcnMsIEZpbGUsIEZvbGRlciB9IGZyb20gXCJmaWxlLXN5c3RlbVwiO1xyXG5pbXBvcnQgeyBvbiBhcyBhcHBsaWNhdGlvbk9uLCBsYXVuY2hFdmVudCwgc3VzcGVuZEV2ZW50LCByZXN1bWVFdmVudCwgZXhpdEV2ZW50LCBsb3dNZW1vcnlFdmVudCwgdW5jYXVnaHRFcnJvckV2ZW50LCBBcHBsaWNhdGlvbkV2ZW50RGF0YSwgc3RhcnQgYXMgYXBwbGljYXRpb25TdGFydCB9IGZyb20gXCJhcHBsaWNhdGlvblwiO1xyXG5cclxuLy9jaGVjayBpdCBhZ2FpblxyXG5hcHBsaWNhdGlvbk9uKGxhdW5jaEV2ZW50LCBmdW5jdGlvbiAoYXJnczogQXBwbGljYXRpb25FdmVudERhdGEpIHtcclxuICAvL1xyXG59KTtcclxuXHJcbi8vY2hlY2sgaXQgYWdhaW5cclxuYXBwbGljYXRpb25PbihzdXNwZW5kRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xyXG4gICBcclxuICAgIGlmKCF0aGlzLl9wbGF5ZXIuaXNBdWRpb1BsYXlpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogXCJIb21lXCIsXHJcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9ob21lLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHRcclxufSlcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQgeyAgXHJcblxyXG4gICAgdXJkdUxpbms6IHN0cmluZyA9ICdodHRwOi8vd3d3LnF1cmFuZG93bmxvYWQuY29tL2xpc3Rlbi10by1xdXJhbi1pbi15b3VyLWxhbmd1YWdlL3VyZHUtdHJhbnNsYXRpb24vMDAxLm1wMyc7ICAgIFxyXG4gICAgcHJpdmF0ZSBfcGxheWVyOiBUTlNQbGF5ZXI7XHJcbiAgICBwdWJsaWMgc3VyYXM6IEFycmF5PFN1cmE+O1xyXG4gICAgcHVibGljIGN1cnJlbnRTdXJhID0gXCI8bm8gc3VyYSBzZWxlY3RlZD5cIjtcclxuICAgIHB1YmxpYyBkdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAgcHVibGljIHNob3dQbGF5aW5nID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBzaG93TG9vcCA9IGZhbHNlO1xyXG4gICAgcHVibGljIHRvdGFsRHVyYXRpb246IHN0cmluZyA9IFwiMFwiO1xyXG4gICAgcHVibGljIHRvdGFsTWlsbGlTZWNzID0gMDtcclxuICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3VyYXMgPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1cmFMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VyYXMucHVzaChuZXcgU3VyYShzdXJhTGlzdFtpXSkpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgbGV0IG5fc3RyOiBhbnkgPSBcIjAwMVwiO1xyXG4gICAgICAgIGlmKGhhc0tleShcInN1cmFOdW1iZXJcIikpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuX3N0ciA9IGdldFN0cmluZyhcInN1cmFOdW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuOm51bWJlcjtcclxuICAgICAgICBuID0gbl9zdHI7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3VyYSA9IG5fc3RyICsgXCI6XCIgKyBzdXJhTGlzdFtuLTFdOyAgICBcclxuXHJcbiAgICAgICAgaWYoaGFzS2V5KFwidG90YWxEdXJhdGlvblwiKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudG90YWxEdXJhdGlvbiA9IGdldFN0cmluZyhcInRvdGFsRHVyYXRpb25cIik7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9wbGF5ZXIgPSBuZXcgVE5TUGxheWVyKCk7XHJcbiAgICB9XHJcblxyXG4gICBcclxuICAgIHByaXZhdGUgX3RyYWNrQ29tcGxldGUoYXJnczogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlZmVyZW5jZSBiYWNrIHRvIHBsYXllcjonLCBhcmdzLnBsYXllcik7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuc2hvd0xvb3ApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRQbGF5KHRoaXMuY3VycmVudFN1cmEpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5zZWVrVG8oMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSB0cnVlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gXHJcbiAgICBwcml2YXRlIF90cmFja0Vycm9yKGFyZ3M6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVuY2UgYmFjayB0byBwbGF5ZXI6JywgYXJncy5wbGF5ZXIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGUgZXJyb3I6JywgYXJncy5lcnJvcik7XHJcbiAgICAgICAgYWxlcnQoXCJFcnJvcjpcIisgYXJncy5lcnJvcik7XHJcbiBcclxuICAgICAgICAvLyBBbmRyb2lkIG9ubHk6IGV4dHJhIGRldGFpbCBvbiBlcnJvclxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdleHRyYSBpbmZvIG9uIHRoZSBlcnJvcjonLCBhcmdzLmV4dHJhKTtcclxuICAgIH1cclxuXHJcbiAgIFxyXG4gICAgcHVibGljIHRvZ2dsZVBsYXkoKSB7XHJcbiAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3BsYXllcik7XHJcbiAgICAgICAgaWYodGhpcy5fcGxheWVyID09IHVuZGVmaW5lZCAmJiB0aGlzLnNob3dQbGF5aW5nKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuOmFueSA9IHRoaXMuY3VycmVudFN1cmEuc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTsgICBcclxuICAgICAgICAgICAgbGV0IG5fc3RyID0gdGhpcy5wcmVmaXhOYnIobik7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUF1ZGlvKG5fc3RyKTsgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBcIjBcIjtcclxuICAgICAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLnNob3dQbGF5aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBsYXkoKTsgIFxyXG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgICAgIC8vdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwiY3VycmVudFRvdGFsRHVyYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0TnVtYmVyKFwiY3VycmVudFRpbWVcIiwgdGhpcy5fcGxheWVyLmN1cnJlbnRUaW1lKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICBcclxuICAgIHB1YmxpYyBuZXh0UGxheShhcmdzKSB7XHJcblxyXG4gICAgICAgIGxldCBuOm51bWJlciA9IGFyZ3Muc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIG4rKztcclxuICAgICAgICBpZiAobiA+IDExNCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgXHJcbiAgICAgICAgbGV0IG5fc3RyID0gdGhpcy5wcmVmaXhOYnIobik7XHJcbiAgICAgICAgdGhpcy5fcGxheWVyLmRpc3Bvc2UoKS50aGVuKChkaXNwb3NlZCkgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYElzRGlzcG9zZWQ6YCwgZGlzcG9zZWQpOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuX3N0cik7ICBcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKTsgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdXJhID0gbl9zdHIgKyBcIjpcIiArIHN1cmFMaXN0W24tMV07IC8vaW5kZXggMCAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZQbGF5KGFyZ3MpIHtcclxuXHJcbiAgICAgICAgbGV0IG46bnVtYmVyID0gYXJncy5zcGxpdChcIjpcIilbMF0udHJpbSgpOyAgICAgICAgXHJcbiAgICAgICAgbi0tO1xyXG4gICAgICAgIGlmIChuIDwgMSkgXHJcbiAgICAgICAgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbl9zdHIgPSB0aGlzLnByZWZpeE5icihuKTsgLy9hdHRhY2ggMCBmeC4gMDAxIG9yIDAxMFxyXG4gICAgICAgIHRoaXMuY3VycmVudFN1cmEgPSBuX3N0ciArIFwiOlwiICsgc3VyYUxpc3Rbbi0xXTsgLy9pbmRleCAwICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcGxheWVyLmRpc3Bvc2UoKS50aGVuKChkaXNwb3NlZCkgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgSXNEaXNwb3NlZDpgLCBkaXNwb3NlZCk7ICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMucGxheUF1ZGlvKG5fc3RyKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvbkl0ZW1UYXAoYXJncykge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IG46IG51bWJlcjtcclxuICAgICAgICBuID0gIGFyZ3MuaW5kZXg7XHJcbiAgICAgICAgbiA9IG4gPT0gdW5kZWZpbmVkID8gYXJncyA6IG47XHJcbiAgICAgICAgbisrO1xyXG4gICAgICAgIGxldCBuX3N0cjpzdHJpbmcgPSB0aGlzLnByZWZpeE5icihuKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3VyYSA9IG5fc3RyICsgXCI6XCIgKyBzdXJhTGlzdFthcmdzLmluZGV4XTtcclxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuX3N0cik7ICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zaG93UGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIC8vdGhpcy5kdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAgICAgIHNldFRpbWVvdXQoIHggPT4geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhnZXRTdHJpbmcoXCJ0b3RhbER1cmF0aW9uXCIpKTtcclxuICAgICAgICAgICAgdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwidG90YWxEdXJhdGlvblwiKTsgICAgICAgICAgIFxyXG4gICAgICAgIH0sIDQwMDApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnRpbWVvdXQoMTApO1xyXG4gICB9XHJcblxyXG4gICBcclxuICAgXHJcbiAgIHB1YmxpYyB0aW1lb3V0KHRpbWVzKVxyXG4gICB7XHJcbiAgICBsZXQgdGhlTG9vcDogKGk6IG51bWJlciwgZGVsYXk/KSA9PiB2b2lkID0gKGk6IG51bWJlciwgZGVsYXkgPSAzMDAwKSA9PiB7XHJcbiAgICAgICAgaWYgKGkgJSAyID09PSAwKSB7XHJcbiAgICAgICAgICAgIGRlbGF5ID0gMTUwMDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKC0taSkge1xyXG4gICAgICAgICAgICAgICAgdGhlTG9vcChpKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgfTsgICAgXHJcbiAgICB0aGVMb29wKDEwKTtcclxuICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbGF5QXVkaW8obl9zdHIpIFxyXG4gICAgeyAgXHJcbiAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqXCIpO1xyXG4gICAgICAgbGV0IG46IG51bWJlcjsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICBzZXRTdHJpbmcoXCJzdXJhTnVtYmVyXCIsbl9zdHIpOyAgICAgICBcclxuICAgICAgIHRoaXMuX3BsYXllci5pbml0RnJvbVVybCh7XHJcbiAgICAgICBhdWRpb0ZpbGU6ICdodHRwOi8vd3d3LnF1cmFuZG93bmxvYWQuY29tL2xpc3Rlbi10by1xdXJhbi1pbi15b3VyLWxhbmd1YWdlL3VyZHUtdHJhbnNsYXRpb24vJytuX3N0cisnLm1wMycsIC8vIH4gPSBhcHAgZGlyZWN0b3J5XHJcbiAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgIGNvbXBsZXRlQ2FsbGJhY2s6IHRoaXMuX3RyYWNrQ29tcGxldGUuYmluZCh0aGlzKSwgICAgICAgIFxyXG4gICAgICAgZXJyb3JDYWxsYmFjazogdGhpcy5fdHJhY2tFcnJvci5iaW5kKHRoaXMpXHJcbiAgIH0pLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLl9wbGF5ZXIucGxheSgpLnRoZW4oKHBsYXlpbmcpID0+IHsgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhgUGxheWluZzpgLCBwbGF5aW5nKTsgICAgICAgICAgIFxyXG4gICAgfSlcclxuICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3BsYXllci5nZXRBdWRpb1RyYWNrRHVyYXRpb24oKS50aGVuKChkdXJhdGlvbikgPT4geyAgICAgICAgICBcclxuICAgICAgICBzZXRTdHJpbmcoXCJ0b3RhbER1cmF0aW9uXCIsIHRoaXMubWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyhkdXJhdGlvbikpO1xyXG4gICAgfSlcclxuICAgfSk7ICBcclxuICAgfVxyXG5cclxuICAgcHVibGljIG1pbGxpc1RvTWludXRlc0FuZFNlY29uZHMobWlsbGlzKSB7XHJcbiAgICAgIFxyXG4gICAgbGV0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKG1pbGxpcyAvIDYwMDAwKTtcclxuICAgIGxldCAgc2Vjb25kcyA9ICgobWlsbGlzICUgNjAwMDApIC8gMTAwMCkudG9GaXhlZCgwKTtcclxuICAgIGxldCByZXN1bHQgPSBtaW51dGVzICsgXCI6XCIgKyAoTnVtYmVyKHNlY29uZHMpIDwgMTAgPyAnMCcgOiAnJykgKyBzZWNvbmRzO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiBcclxuICAgcHVibGljIHByZWZpeE5icihuKTogc3RyaW5nXHJcbiAgIHtcclxuICAgICAgIGxldCBuX3N0cjpzdHJpbmcgPSBuLnRvU3RyaW5nKCk7XHJcbiAgICAgICBpZiAobi50b1N0cmluZygpLmxlbmd0aCA9PSAxKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgbl9zdHIgPSBcIjAwXCIrbi50b1N0cmluZygpOyAgXHJcbiAgICAgICB9IGVsc2UgaWYobi50b1N0cmluZygpLmxlbmd0aCA9PSAyKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgbl9zdHIgPSBcIjBcIituLnRvU3RyaW5nKCk7ICBcclxuICAgICAgIH1cclxuICAgICAgIGVsc2VcclxuICAgICAgIHtcclxuICAgICAgICAgIG5fc3RyID0gbi50b1N0cmluZygpO1xyXG4gICAgICAgfVxyXG4gICAgICByZXR1cm4gbl9zdHI7XHJcbiAgIH1cclxuXHJcbiAgIHB1YmxpYyBsb29wQWxsKCkgXHJcbiAgIHtcclxuICAgICAgIHRoaXMuc2hvd0xvb3AgPSAhdGhpcy5zaG93TG9vcCA/IHRydWUgOiBmYWxzZTtcclxuICAgfVxyXG4gICAgcHVibGljIGRlbGF5KG1zOiBudW1iZXIpIFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxuICAgIH1cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgKiBVc2UgdGhlIFwibmdPbkluaXRcIiBoYW5kbGVyIHRvIGluaXRpYWxpemUgZGF0YSBmb3IgdGhlIHZpZXcuXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgICAgICAvL3RoaXMudG90YWxEdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcbi8vaW50ZXJuYWwgY2xhc3NcclxuY2xhc3MgU3VyYSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7IH1cclxufVxyXG5cclxuLy9uYW1lcyBvZiBhbGwgc3VyYXMnXHJcbmxldCBzdXJhTGlzdCA9IFtcclxuICAgIFwiQWwtRmF0aWhhaCAoVGhlIE9wZW5pbmcpXCIsXHJcblwiQWwtQmFxYXJhaCAoVGhlIENvdylcIixcclxuXCJBbC0nSW1yYW4gKFRoZSBGYW1pbHkgb2YgQW1yYW4pXCIsXHJcblwiQW4tTmlzYScgKFRoZSBXb21lbilcIixcclxuXCJBbC1NYSdpZGFoIChUaGUgRm9vZClcIixcclxuXCJBbC1BbidhbSAoVGhlIENhdHRsZSlcIixcclxuXCJBbC1BJ3JhZiAoVGhlIEVsZXZhdGVkIFBsYWNlcylcIixcclxuXCJBbC1BbmZhbCAoVm9sdW50YXJ5IEdpZnRzKVwiLFxyXG5cIkFsLUJhcmEnYXQgLyBBdC1UYXViYWgoVGhlIEltbXVuaXR5KVwiLFxyXG5cIll1bnVzIChKb25haClcIixcclxuXCJIdWQgKEh1ZClcIixcclxuXCJZdXN1ZiAoSm9zZXBoKVwiLFxyXG5cIkFyLVJhJ2QgKFRoZSBUaHVuZGVyKVwiLFxyXG5cIklicmFoaW0gKEFicmFoYW0pXCIsXHJcblwiQWwtSGlqciAoVGhlIFJvY2spXCIsXHJcblwiQW4tTmFobCAoVGhlIEJlZSlcIixcclxuXCJCYW5pIElzcmEnaWwgKFRoZSBJc3JhZWxpdGVzKVwiLFxyXG5cIkFsLUthaGYgKFRoZSBDYXZlKVwiLFxyXG5cIk1hcnlhbSAoTWFyeSlcIixcclxuXCJUYSBIYSAoVGEgSGEpXCIsXHJcblwiQWwtQW5iaXlhJyAoVGhlIFByb3BoZXRzKVwiLFxyXG5cIkFsLUhhamogKFRoZSBQaWxncmltYWdlKVwiLFxyXG5cIkFsLU11J21pbnVuIChUaGUgQmVsaWV2ZXJzKVwiLFxyXG5cIkFuLU51ciAoVGhlIExpZ2h0KVwiLFxyXG5cIkFsLUZ1cnFhbiAoVGhlIERpc2NyaW1pbmF0aW9uKVwiLFxyXG5cIkFzaC1TaHUnYXJhJyAoVGhlIFBvZXRzKVwiLFxyXG5cIkFuLU5hbWwgKFRoZSBOYW1sKVwiLFxyXG5cIkFsLVFhc2FzIChUaGUgTmFycmF0aXZlKVwiLFxyXG5cIkFsLSdBbmthYnV0IChUaGUgU3BpZGVyKVwiLFxyXG5cIkFyLVJ1bSAoVGhlIFJvbWFucylcIixcclxuXCJMdXFtYW4gKEx1cW1hbilcIixcclxuXCJBcy1TYWpkYWggKFRoZSBBZG9yYXRpb24pXCIsXHJcblwiQWwtQWh6YWIgKFRoZSBBbGxpZXMpXCIsXHJcblwiQWwtU2FiYScgKFRoZSBTYWJhJylcIixcclxuXCJBbC1GYXRpciAoVGhlIE9yaWdpbmF0b3IpXCIsXHJcblwiWWEgU2luIChZYSBTaW4pXCIsXHJcblwiQXMtU2FmZmF0IChUaG9zZSBSYW5naW5nIGluIFJhbmtzKVwiLFxyXG5cIlNhZCAoU2FkKVwiLFxyXG5cIkF6LVp1bWFyIChUaGUgQ29tcGFuaWVzKVwiLFxyXG5cIkFsLU11J21pbiAoVGhlIEJlbGlldmVyKVwiLFxyXG5cIkhhIE1pbSAoSGEgTWltKVwiLFxyXG5cIkFzaC1TaHVyYSAoQ291bnNlbClcIixcclxuXCJBei1adWtocnVmIChHb2xkKVwiLFxyXG5cIkFkLUR1a2hhbiAoVGhlIERyb3VnaHQpXCIsXHJcblwiQWwtSmF0aGl5YWggKFRoZSBLbmVlbGluZylcIixcclxuXCJBbC1BaHFhZiAoVGhlIFNhbmRoaWxscylcIixcclxuXCJNdWhhbW1hZCAoTXVoYW1tYWQpXCIsXHJcblwiQWwtRmF0aCAoVGhlIFZpY3RvcnkpXCIsXHJcblwiQWwtSHVqdXJhdCAoVGhlIEFwYXJ0bWVudHMpXCIsXHJcblwiUWFmIChRYWYpXCIsXHJcblwiQWQtRGhhcml5YXQgKFRoZSBTY2F0dGVyZXJzKVwiLFxyXG5cIkF0LVR1ciAoVGhlIE1vdW50YWluKVwiLFxyXG5cIkFuLU5ham0gKFRoZSBTdGFyKVwiLFxyXG5cIkFsLVFhbWFyIChUaGUgTW9vbilcIixcclxuXCJBci1SYWhtYW4gKFRoZSBCZW5lZmljZW50KVwiLFxyXG5cIkFsLVdhcWknYWggKFRoZSBFdmVudClcIixcclxuXCJBbC1IYWRpZCAoSXJvbilcIixcclxuXCJBbC1NdWphZGlsYWggKFRoZSBQbGVhZGluZyBXb21hbilcIixcclxuXCJBbC1IYXNociAoVGhlIEJhbmlzaG1lbnQpXCIsXHJcblwiQWwtTXVtdGFoYW5haCAoVGhlIFdvbWFuIHdobyBpcyBFeGFtaW5lZClcIixcclxuXCJBcy1TYWZmIChUaGUgUmFua3MpXCIsXHJcblwiQWwtSnVtdSdhaCAoVGhlIENvbmdyZWdhdGlvbilcIixcclxuXCJBbC1NdW5hZmlxdW4gKFRoZSBIeXBvY3JpdGVzKVwiLFxyXG5cIkF0LVRhZ2hhYnVuIChUaGUgTWFuaWZlc3RhdGlvbiBvZiBMb3NzZXMpXCIsXHJcblwiQXQtVGFsYXEgKERpdm9yY2UpXCIsXHJcblwiQXQtVGFocmltIChUaGUgUHJvaGliaXRpb24pXCIsXHJcblwiQWwtTXVsayAoVGhlIEtpbmdkb20pXCIsXHJcblwiQWwtUWFsYW0gKFRoZSBQZW4pXCIsXHJcblwiQWwtSGFxcWFoIChUaGUgU3VyZSBUcnV0aClcIixcclxuXCJBbC1NYSdhcmlqIChUaGUgV2F5cyBvZiBBc2NlbnQpXCIsXHJcblwiTnVoIChOb2FoKVwiLFxyXG5cIkFsLUppbm4gKFRoZSBKaW5uKVwiLFxyXG5cIkFsLU11enphbW1pbCAoVGhlIE9uZSBDb3ZlcmluZyBIaW1zZWxmKVwiLFxyXG5cIkFsLU11ZGRhdGh0aGlyIChUaGUgT25lIFdyYXBwaW5nIEhpbXNlbGYgVXApXCIsXHJcblwiQWwtUWl5YW1haCAoVGhlIFJlc3VycmVjdGlvbilcIixcclxuXCJBbC1JbnNhbiAoVGhlIE1hbilcIixcclxuXCJBbC1NdXJzYWxhdCAoVGhvc2UgU2VudCBGb3J0aClcIixcclxuXCJBbi1OYWJhJyAoVGhlIEFubm91bmNlbWVudClcIixcclxuXCJBbi1OYXppJ2F0IChUaG9zZSBXaG8gWWVhcm4pXCIsXHJcblwiJ0FiYXNhIChIZSBGcm93bmVkKVwiLFxyXG5cIkF0LVRha3dpciAoVGhlIEZvbGRpbmcgVXApXCIsXHJcblwiQWwtSW5maXRhciAoVGhlIENsZWF2aW5nKVwiLFxyXG5cIkF0LVRhdGZpZiAoRGVmYXVsdCBpbiBEdXR5KVwiLFxyXG5cIkFsLUluc2hpcWFxIChUaGUgQnVyc3RpbmcgQXN1bmRlcilcIixcclxuXCJBbC1CdXJ1aiAoVGhlIFN0YXJzKVwiLFxyXG5cIkF0LVRhcmlxIChUaGUgQ29tZXIgYnkgTmlnaHQpXCIsXHJcblwiQWwtQSdsYSAoVGhlIE1vc3QgSGlnaClcIixcclxuXCJBbC1HaGFzaGl5YWggKFRoZSBPdmVyd2hlbG1pbmcgRXZlbnQpXCIsXHJcblwiQWwtRmFqciAoVGhlIERheWJyZWFrKVwiLFxyXG5cIkFsLUJhbGFkIChUaGUgQ2l0eSlcIixcclxuXCJBc2gtU2hhbXMgKFRoZSBTdW4pXCIsXHJcblwiQWwtTGFpbCAoVGhlIE5pZ2h0KVwiLFxyXG5cIkFkLUR1aGEgKFRoZSBCcmlnaHRuZXNzIG9mIHRoZSBEYXkpXCIsXHJcblwiQWwtSW5zaGlyYWggKFRoZSBFeHBhbnNpb24pXCIsXHJcblwiQXQtVGluIChUaGUgRmlnKVwiLFxyXG5cIkFsLSdBbGFxIChUaGUgQ2xvdClcIixcclxuXCJBbC1RYWRyIChUaGUgTWFqZXN0eSlcIixcclxuXCJBbC1CYXl5aW5haCAoVGhlIENsZWFyIEV2aWRlbmNlKVwiLFxyXG5cIkFsLVppbHphbCAoVGhlIFNoYWtpbmcpXCIsXHJcblwiQWwtJ0FkaXlhdCAoVGhlIEFzc2F1bHRlcnMpXCIsXHJcblwiQWwtUWFyaSdhaCAoVGhlIENhbGFtaXR5KVwiLFxyXG5cIkF0LVRha2F0aHVyIChUaGUgQWJ1bmRhbmNlIG9mIFdlYWx0aClcIixcclxuXCJBbC0nQXNyIChUaGUgVGltZSlcIixcclxuXCJBbC1IdW1hemFoIChUaGUgU2xhbmRlcmVyKVwiLFxyXG5cIkFsLUZpbCAoVGhlIEVsZXBoYW50KVwiLFxyXG5cIkFsLVF1cmFpc2ggKFRoZSBRdXJhaXNoKVwiLFxyXG5cIkFsLU1hJ3VuIChBY3RzIG9mIEtpbmRuZXNzKVwiLFxyXG5cIkFsLUthdXRoYXIgKFRoZSBBYnVuZGFuY2Ugb2YgR29vZClcIixcclxuXCJBbC1LYWZpcnVuIChUaGUgRGlzYmVsaWV2ZXJzKVwiLFxyXG5cIkFuLU5hc3IgKFRoZSBIZWxwKVwiLFxyXG5cIkFsLUxhaGFiIChUaGUgRmxhbWUpXCIsXHJcblwiQWwtSWtobGFzIChUaGUgVW5pdHkpXCIsXHJcblwiQWwtRmFsYXEgKFRoZSBEYXduKVwiLFxyXG5cIkFuLU5hcyAoVGhlIE1lbilcIlxyXG5dO1xyXG5cclxuXHJcblxyXG4vLzAwMS0xMTRcclxuLy9odHRwOi8vd3d3LnF1cmFuZG93bmxvYWQuY29tL2xpc3Rlbi10by1xdXJhbi1pbi15b3VyLWxhbmd1YWdlL3VyZHUtdHJhbnNsYXRpb24vMDAxLm1wMyJdfQ==