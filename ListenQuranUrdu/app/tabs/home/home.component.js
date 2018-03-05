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
        this.totalDurationAfterPlay = "";
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
        this.duration = "0";
        //console.log("onTapItem:totalduration:" + getString("currentTotalDuration")); 
        setTimeout(function (x) {
            console.log(_this.totalDurationAfterPlay);
            _this.totalDuration = application_settings_1.getString("totalDuration");
            console.log(application_settings_1.getString("totalDuration"));
            _this.duration = application_settings_1.getString("totalDuration");
        }, 4000);
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
                _this.totalDurationAfterPlay = _this.millisToMinutesAndSeconds(duration);
                application_settings_1.setString("totalDuration", _this.totalDurationAfterPlay);
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
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNDQUEyRTtBQUMzRSx5REFBK0M7QUFFL0MsNkRBQXlHO0FBR3pHLDJDQUEwTDtBQUUxTCxnQkFBZ0I7QUFDaEIsZ0JBQWEsQ0FBQyx5QkFBVyxFQUFFLFVBQVUsSUFBMEI7SUFDN0QsRUFBRTtBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsZ0JBQWdCO0FBQ2hCLGdCQUFhLENBQUMsMEJBQVksRUFBRSxVQUFVLElBQTBCO0lBRTVELEVBQUUsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FDaEMsQ0FBQztRQUNHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBV0g7SUFZSTtRQVZBLGFBQVEsR0FBVyx3RkFBd0YsQ0FBQztRQUdyRyxnQkFBVyxHQUFHLG9CQUFvQixDQUFDO1FBQ25DLGFBQVEsR0FBRyxHQUFHLENBQUM7UUFDZixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLDJCQUFzQixHQUFHLEVBQUUsQ0FBQztRQUkvQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxJQUFJLEtBQUssR0FBUSxLQUFLLENBQUM7UUFDdkIs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QUF5QjtJQUN6Qix1Q0FBdUM7SUFDdkMsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQixxQkFBcUI7SUFDckIscUJBQXFCO0lBQ3JCLHFDQUFxQztJQUNyQyw2QkFBNkI7SUFDN0Isa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQix1QkFBdUI7SUFDdkIsa0NBQWtDO0lBQ2xDLHlCQUF5QjtJQUN6Qiw2QkFBNkI7SUFDN0IsMkJBQTJCO0lBQzNCLHVDQUF1QztJQUN2QyxvQkFBb0I7SUFDcEIsNEJBQTRCO0lBQzVCLHVCQUF1QjtJQUN2QiwwQkFBMEI7SUFDMUIsNkJBQTZCO0lBQzdCLG9DQUFvQztJQUNwQywrQkFBK0I7SUFDL0Isb0JBQW9CO0lBQ3BCLHNCQUFzQjtJQUN0Qix1QkFBdUI7SUFDdkIscUJBQXFCO0lBQ3JCLGtCQUFrQjtDQUNqQixDQUFDO0FBSUYsU0FBUztBQUNULHdGQUF3RiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSAgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBUTlNQbGF5ZXIgfSBmcm9tICduYXRpdmVzY3JpcHQtYXVkaW8nO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCJ1aS9sYWJlbFwiO1xyXG5pbXBvcnQgeyBnZXROdW1iZXIsIHNldE51bWJlciwgZ2V0U3RyaW5nLCBzZXRTdHJpbmcsIGhhc0tleSwgcmVtb3ZlLCBjbGVhciB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjsgXHJcbmltcG9ydCB7IGtub3duRm9sZGVycywgRmlsZSwgRm9sZGVyIH0gZnJvbSBcImZpbGUtc3lzdGVtXCI7XHJcbmltcG9ydCB7IG9uIGFzIGFwcGxpY2F0aW9uT24sIGxhdW5jaEV2ZW50LCBzdXNwZW5kRXZlbnQsIHJlc3VtZUV2ZW50LCBleGl0RXZlbnQsIGxvd01lbW9yeUV2ZW50LCB1bmNhdWdodEVycm9yRXZlbnQsIEFwcGxpY2F0aW9uRXZlbnREYXRhLCBzdGFydCBhcyBhcHBsaWNhdGlvblN0YXJ0IH0gZnJvbSBcImFwcGxpY2F0aW9uXCI7XHJcblxyXG4vL2NoZWNrIGl0IGFnYWluXHJcbmFwcGxpY2F0aW9uT24obGF1bmNoRXZlbnQsIGZ1bmN0aW9uIChhcmdzOiBBcHBsaWNhdGlvbkV2ZW50RGF0YSkge1xyXG4gIC8vXHJcbn0pO1xyXG5cclxuLy9jaGVjayBpdCBhZ2FpblxyXG5hcHBsaWNhdGlvbk9uKHN1c3BlbmRFdmVudCwgZnVuY3Rpb24gKGFyZ3M6IEFwcGxpY2F0aW9uRXZlbnREYXRhKSB7XHJcbiAgIFxyXG4gICAgaWYoIXRoaXMuX3BsYXllci5pc0F1ZGlvUGxheWluZylcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9wbGF5ZXIucGF1c2UoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIkhvbWVcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2hvbWUuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcblxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBIb21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHsgIFxyXG5cclxuICAgIHVyZHVMaW5rOiBzdHJpbmcgPSAnaHR0cDovL3d3dy5xdXJhbmRvd25sb2FkLmNvbS9saXN0ZW4tdG8tcXVyYW4taW4teW91ci1sYW5ndWFnZS91cmR1LXRyYW5zbGF0aW9uLzAwMS5tcDMnOyAgICBcclxuICAgIHByaXZhdGUgX3BsYXllcjogVE5TUGxheWVyO1xyXG4gICAgcHVibGljIHN1cmFzOiBBcnJheTxTdXJhPjtcclxuICAgIHB1YmxpYyBjdXJyZW50U3VyYSA9IFwiPG5vIHN1cmEgc2VsZWN0ZWQ+XCI7XHJcbiAgICBwdWJsaWMgZHVyYXRpb24gPSBcIjBcIjtcclxuICAgIHB1YmxpYyBzaG93UGxheWluZyA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2hvd0xvb3AgPSBmYWxzZTtcclxuICAgIHB1YmxpYyB0b3RhbER1cmF0aW9uID0gXCIwXCI7XHJcbiAgICBwdWJsaWMgdG90YWxEdXJhdGlvbkFmdGVyUGxheSA9IFwiXCI7XHJcbiAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnN1cmFzID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdXJhTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnN1cmFzLnB1c2gobmV3IFN1cmEoc3VyYUxpc3RbaV0pKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGxldCBuX3N0cjogYW55ID0gXCIwMDFcIjtcclxuICAgICAgICBpZihoYXNLZXkoXCJzdXJhTnVtYmVyXCIpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbl9zdHIgPSBnZXRTdHJpbmcoXCJzdXJhTnVtYmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbjpudW1iZXI7XHJcbiAgICAgICAgbiA9IG5fc3RyO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN1cmEgPSBuX3N0ciArIFwiOlwiICsgc3VyYUxpc3Rbbi0xXTsgICAgXHJcblxyXG4gICAgICAgIGlmKGhhc0tleShcInRvdGFsRHVyYXRpb25cIikpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJ0b3RhbER1cmF0aW9uXCIpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcGxheWVyID0gbmV3IFROU1BsYXllcigpO1xyXG4gICAgfVxyXG5cclxuICAgXHJcbiAgICBwcml2YXRlIF90cmFja0NvbXBsZXRlKGFyZ3M6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVuY2UgYmFjayB0byBwbGF5ZXI6JywgYXJncy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnNob3dMb29wKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0UGxheSh0aGlzLmN1cnJlbnRTdXJhKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuc2Vla1RvKDApO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gdHJ1ZTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuIFxyXG4gICAgcHJpdmF0ZSBfdHJhY2tFcnJvcihhcmdzOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVmZXJlbmNlIGJhY2sgdG8gcGxheWVyOicsIGFyZ3MucGxheWVyKTtcclxuICAgICAgICBjb25zb2xlLmxvZygndGhlIGVycm9yOicsIGFyZ3MuZXJyb3IpO1xyXG4gICAgICAgIGFsZXJ0KFwiRXJyb3I6XCIrIGFyZ3MuZXJyb3IpO1xyXG4gXHJcbiAgICAgICAgLy8gQW5kcm9pZCBvbmx5OiBleHRyYSBkZXRhaWwgb24gZXJyb3JcclxuICAgICAgICBjb25zb2xlLmxvZygnZXh0cmEgaW5mbyBvbiB0aGUgZXJyb3I6JywgYXJncy5leHRyYSk7XHJcbiAgICB9XHJcblxyXG4gICBcclxuICAgIHB1YmxpYyB0b2dnbGVQbGF5KCkge1xyXG4gICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9wbGF5ZXIpO1xyXG4gICAgICAgIGlmKHRoaXMuX3BsYXllciA9PSB1bmRlZmluZWQgJiYgdGhpcy5zaG93UGxheWluZylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICBsZXQgbjphbnkgPSB0aGlzLmN1cnJlbnRTdXJhLnNwbGl0KFwiOlwiKVswXS50cmltKCk7ICAgXHJcbiAgICAgICAgICAgIGxldCBuX3N0ciA9IHRoaXMucHJlZml4TmJyKG4pO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXlBdWRpbyhuX3N0cik7ICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5zaG93UGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgICAgIC8vdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwiY3VycmVudFRvdGFsRHVyYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5zaG93UGxheWluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5wbGF5KCk7ICBcclxuICAgICAgICAgICAgdGhpcy5kdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAgICAgICAgICAvL3RoaXMudG90YWxEdXJhdGlvbiA9IGdldFN0cmluZyhcImN1cnJlbnRUb3RhbER1cmF0aW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5zaG93UGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5wYXVzZSgpOyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNldE51bWJlcihcImN1cnJlbnRUaW1lXCIsIHRoaXMuX3BsYXllci5jdXJyZW50VGltZSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgXHJcbiAgICBwdWJsaWMgbmV4dFBsYXkoYXJncykge1xyXG5cclxuICAgICAgICBsZXQgbjpudW1iZXIgPSBhcmdzLnNwbGl0KFwiOlwiKVswXS50cmltKCk7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBuKys7XHJcbiAgICAgICAgaWYgKG4gPiAxMTQpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gXHJcbiAgICAgIFxyXG4gICAgICAgIGxldCBuX3N0ciA9IHRoaXMucHJlZml4TmJyKG4pO1xyXG4gICAgICAgIHRoaXMuX3BsYXllci5kaXNwb3NlKCkudGhlbigoZGlzcG9zZWQpID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBJc0Rpc3Bvc2VkOmAsIGRpc3Bvc2VkKTsgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5QXVkaW8obl9zdHIpOyAgXHJcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAgICAgIC8vdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwiY3VycmVudFRvdGFsRHVyYXRpb25cIik7ICAgICBcclxuICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3VyYSA9IG5fc3RyICsgXCI6XCIgKyBzdXJhTGlzdFtuLTFdOyAvL2luZGV4IDAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmV2UGxheShhcmdzKSB7XHJcblxyXG4gICAgICAgIGxldCBuOm51bWJlciA9IGFyZ3Muc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTsgICAgICAgIFxyXG4gICAgICAgIG4tLTtcclxuICAgICAgICBpZiAobiA8IDEpIFxyXG4gICAgICAgIHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IG5fc3RyID0gdGhpcy5wcmVmaXhOYnIobik7IC8vYXR0YWNoIDAgZnguIDAwMSBvciAwMTBcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdXJhID0gbl9zdHIgKyBcIjpcIiArIHN1cmFMaXN0W24tMV07IC8vaW5kZXggMCAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3BsYXllci5kaXNwb3NlKCkudGhlbigoZGlzcG9zZWQpID0+IHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYElzRGlzcG9zZWQ6YCwgZGlzcG9zZWQpOyAgICAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuX3N0cik7ICAgICAgICBcclxuICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAgICAgIC8vdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwiY3VycmVudFRvdGFsRHVyYXRpb25cIik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb25JdGVtVGFwKGFyZ3MpIHtcclxuICAgIFxyXG4gICAgICAgIGxldCBuOiBudW1iZXI7XHJcbiAgICAgICAgbiA9ICBhcmdzLmluZGV4O1xyXG4gICAgICAgIG4gPSBuID09IHVuZGVmaW5lZCA/IGFyZ3MgOiBuO1xyXG4gICAgICAgIG4rKztcclxuICAgICAgICBsZXQgbl9zdHI6c3RyaW5nID0gdGhpcy5wcmVmaXhOYnIobik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN1cmEgPSBuX3N0ciArIFwiOlwiICsgc3VyYUxpc3RbYXJncy5pbmRleF07XHJcbiAgICAgICAgdGhpcy5wbGF5QXVkaW8obl9zdHIpOyAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIm9uVGFwSXRlbTp0b3RhbGR1cmF0aW9uOlwiICsgZ2V0U3RyaW5nKFwiY3VycmVudFRvdGFsRHVyYXRpb25cIikpOyBcclxuICAgICAgICBzZXRUaW1lb3V0KCB4ID0+IHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMudG90YWxEdXJhdGlvbkFmdGVyUGxheSk7ICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMudG90YWxEdXJhdGlvbiA9IGdldFN0cmluZyhcInRvdGFsRHVyYXRpb25cIik7ICBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZ2V0U3RyaW5nKFwidG90YWxEdXJhdGlvblwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBnZXRTdHJpbmcoXCJ0b3RhbER1cmF0aW9uXCIpOyAgXHJcbiAgICAgICAgfSwgNDAwMCk7XHJcblxyXG4gICB9XHJcblxyXG4gICBcclxuICAgIHB1YmxpYyBwbGF5QXVkaW8obl9zdHIpIFxyXG4gICAgeyAgXHJcbiAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqXCIpO1xyXG4gICAgICAgbGV0IG46IG51bWJlcjsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICBzZXRTdHJpbmcoXCJzdXJhTnVtYmVyXCIsbl9zdHIpOyAgICAgICBcclxuICAgICAgIHRoaXMuX3BsYXllci5pbml0RnJvbVVybCh7XHJcbiAgICAgICBhdWRpb0ZpbGU6ICdodHRwOi8vd3d3LnF1cmFuZG93bmxvYWQuY29tL2xpc3Rlbi10by1xdXJhbi1pbi15b3VyLWxhbmd1YWdlL3VyZHUtdHJhbnNsYXRpb24vJytuX3N0cisnLm1wMycsIC8vIH4gPSBhcHAgZGlyZWN0b3J5XHJcbiAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgIGNvbXBsZXRlQ2FsbGJhY2s6IHRoaXMuX3RyYWNrQ29tcGxldGUuYmluZCh0aGlzKSwgICAgICAgIFxyXG4gICAgICAgZXJyb3JDYWxsYmFjazogdGhpcy5fdHJhY2tFcnJvci5iaW5kKHRoaXMpXHJcbiAgIH0pLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLl9wbGF5ZXIucGxheSgpLnRoZW4oKHBsYXlpbmcpID0+IHsgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhgUGxheWluZzpgLCBwbGF5aW5nKTsgICAgICAgICAgIFxyXG4gICAgfSlcclxuICAgIH0pLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3BsYXllci5nZXRBdWRpb1RyYWNrRHVyYXRpb24oKS50aGVuKChkdXJhdGlvbikgPT4geyAgXHJcbiAgICAgICAgdGhpcy50b3RhbER1cmF0aW9uQWZ0ZXJQbGF5ID0gdGhpcy5taWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKGR1cmF0aW9uKTsgIFxyXG4gICAgICAgIHNldFN0cmluZyhcInRvdGFsRHVyYXRpb25cIiwgdGhpcy50b3RhbER1cmF0aW9uQWZ0ZXJQbGF5KTtcclxuICAgIH0pXHJcbiAgIH0pOyAgXHJcbiAgIH1cclxuXHJcbiAgIHB1YmxpYyBtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKG1pbGxpcykge1xyXG4gICAgICBcclxuICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcihtaWxsaXMgLyA2MDAwMCk7XHJcbiAgICBsZXQgIHNlY29uZHMgPSAoKG1pbGxpcyAlIDYwMDAwKSAvIDEwMDApLnRvRml4ZWQoMCk7XHJcbiAgICBsZXQgcmVzdWx0ID0gbWludXRlcyArIFwiOlwiICsgKE51bWJlcihzZWNvbmRzKSA8IDEwID8gJzAnIDogJycpICsgc2Vjb25kcztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gXHJcbiAgIHB1YmxpYyBwcmVmaXhOYnIobik6IHN0cmluZ1xyXG4gICB7XHJcbiAgICAgICBsZXQgbl9zdHI6c3RyaW5nID0gbi50b1N0cmluZygpO1xyXG4gICAgICAgaWYgKG4udG9TdHJpbmcoKS5sZW5ndGggPT0gMSlcclxuICAgICAgIHtcclxuICAgICAgICAgIG5fc3RyID0gXCIwMFwiK24udG9TdHJpbmcoKTsgIFxyXG4gICAgICAgfSBlbHNlIGlmKG4udG9TdHJpbmcoKS5sZW5ndGggPT0gMilcclxuICAgICAgIHtcclxuICAgICAgICAgIG5fc3RyID0gXCIwXCIrbi50b1N0cmluZygpOyAgXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlXHJcbiAgICAgICB7XHJcbiAgICAgICAgICBuX3N0ciA9IG4udG9TdHJpbmcoKTtcclxuICAgICAgIH1cclxuICAgICAgcmV0dXJuIG5fc3RyO1xyXG4gICB9XHJcblxyXG4gICBwdWJsaWMgbG9vcEFsbCgpIFxyXG4gICB7XHJcbiAgICAgICB0aGlzLnNob3dMb29wID0gIXRoaXMuc2hvd0xvb3AgPyB0cnVlIDogZmFsc2U7XHJcbiAgIH1cclxuICAgIHB1YmxpYyBkZWxheShtczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbiAgICB9XHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICogVXNlIHRoZSBcIm5nT25Jbml0XCIgaGFuZGxlciB0byBpbml0aWFsaXplIGRhdGEgZm9yIHRoZSB2aWV3LlxyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBcIjBcIjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4vL2ludGVybmFsIGNsYXNzXHJcbmNsYXNzIFN1cmEge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykgeyB9XHJcbn1cclxuXHJcbi8vbmFtZXMgb2YgYWxsIHN1cmFzJ1xyXG5sZXQgc3VyYUxpc3QgPSBbXHJcbiAgICBcIkFsLUZhdGloYWggKFRoZSBPcGVuaW5nKVwiLFxyXG5cIkFsLUJhcWFyYWggKFRoZSBDb3cpXCIsXHJcblwiQWwtJ0ltcmFuIChUaGUgRmFtaWx5IG9mIEFtcmFuKVwiLFxyXG5cIkFuLU5pc2EnIChUaGUgV29tZW4pXCIsXHJcblwiQWwtTWEnaWRhaCAoVGhlIEZvb2QpXCIsXHJcblwiQWwtQW4nYW0gKFRoZSBDYXR0bGUpXCIsXHJcblwiQWwtQSdyYWYgKFRoZSBFbGV2YXRlZCBQbGFjZXMpXCIsXHJcblwiQWwtQW5mYWwgKFZvbHVudGFyeSBHaWZ0cylcIixcclxuXCJBbC1CYXJhJ2F0IC8gQXQtVGF1YmFoKFRoZSBJbW11bml0eSlcIixcclxuXCJZdW51cyAoSm9uYWgpXCIsXHJcblwiSHVkIChIdWQpXCIsXHJcblwiWXVzdWYgKEpvc2VwaClcIixcclxuXCJBci1SYSdkIChUaGUgVGh1bmRlcilcIixcclxuXCJJYnJhaGltIChBYnJhaGFtKVwiLFxyXG5cIkFsLUhpanIgKFRoZSBSb2NrKVwiLFxyXG5cIkFuLU5haGwgKFRoZSBCZWUpXCIsXHJcblwiQmFuaSBJc3JhJ2lsIChUaGUgSXNyYWVsaXRlcylcIixcclxuXCJBbC1LYWhmIChUaGUgQ2F2ZSlcIixcclxuXCJNYXJ5YW0gKE1hcnkpXCIsXHJcblwiVGEgSGEgKFRhIEhhKVwiLFxyXG5cIkFsLUFuYml5YScgKFRoZSBQcm9waGV0cylcIixcclxuXCJBbC1IYWpqIChUaGUgUGlsZ3JpbWFnZSlcIixcclxuXCJBbC1NdSdtaW51biAoVGhlIEJlbGlldmVycylcIixcclxuXCJBbi1OdXIgKFRoZSBMaWdodClcIixcclxuXCJBbC1GdXJxYW4gKFRoZSBEaXNjcmltaW5hdGlvbilcIixcclxuXCJBc2gtU2h1J2FyYScgKFRoZSBQb2V0cylcIixcclxuXCJBbi1OYW1sIChUaGUgTmFtbClcIixcclxuXCJBbC1RYXNhcyAoVGhlIE5hcnJhdGl2ZSlcIixcclxuXCJBbC0nQW5rYWJ1dCAoVGhlIFNwaWRlcilcIixcclxuXCJBci1SdW0gKFRoZSBSb21hbnMpXCIsXHJcblwiTHVxbWFuIChMdXFtYW4pXCIsXHJcblwiQXMtU2FqZGFoIChUaGUgQWRvcmF0aW9uKVwiLFxyXG5cIkFsLUFoemFiIChUaGUgQWxsaWVzKVwiLFxyXG5cIkFsLVNhYmEnIChUaGUgU2FiYScpXCIsXHJcblwiQWwtRmF0aXIgKFRoZSBPcmlnaW5hdG9yKVwiLFxyXG5cIllhIFNpbiAoWWEgU2luKVwiLFxyXG5cIkFzLVNhZmZhdCAoVGhvc2UgUmFuZ2luZyBpbiBSYW5rcylcIixcclxuXCJTYWQgKFNhZClcIixcclxuXCJBei1adW1hciAoVGhlIENvbXBhbmllcylcIixcclxuXCJBbC1NdSdtaW4gKFRoZSBCZWxpZXZlcilcIixcclxuXCJIYSBNaW0gKEhhIE1pbSlcIixcclxuXCJBc2gtU2h1cmEgKENvdW5zZWwpXCIsXHJcblwiQXotWnVraHJ1ZiAoR29sZClcIixcclxuXCJBZC1EdWtoYW4gKFRoZSBEcm91Z2h0KVwiLFxyXG5cIkFsLUphdGhpeWFoIChUaGUgS25lZWxpbmcpXCIsXHJcblwiQWwtQWhxYWYgKFRoZSBTYW5kaGlsbHMpXCIsXHJcblwiTXVoYW1tYWQgKE11aGFtbWFkKVwiLFxyXG5cIkFsLUZhdGggKFRoZSBWaWN0b3J5KVwiLFxyXG5cIkFsLUh1anVyYXQgKFRoZSBBcGFydG1lbnRzKVwiLFxyXG5cIlFhZiAoUWFmKVwiLFxyXG5cIkFkLURoYXJpeWF0IChUaGUgU2NhdHRlcmVycylcIixcclxuXCJBdC1UdXIgKFRoZSBNb3VudGFpbilcIixcclxuXCJBbi1OYWptIChUaGUgU3RhcilcIixcclxuXCJBbC1RYW1hciAoVGhlIE1vb24pXCIsXHJcblwiQXItUmFobWFuIChUaGUgQmVuZWZpY2VudClcIixcclxuXCJBbC1XYXFpJ2FoIChUaGUgRXZlbnQpXCIsXHJcblwiQWwtSGFkaWQgKElyb24pXCIsXHJcblwiQWwtTXVqYWRpbGFoIChUaGUgUGxlYWRpbmcgV29tYW4pXCIsXHJcblwiQWwtSGFzaHIgKFRoZSBCYW5pc2htZW50KVwiLFxyXG5cIkFsLU11bXRhaGFuYWggKFRoZSBXb21hbiB3aG8gaXMgRXhhbWluZWQpXCIsXHJcblwiQXMtU2FmZiAoVGhlIFJhbmtzKVwiLFxyXG5cIkFsLUp1bXUnYWggKFRoZSBDb25ncmVnYXRpb24pXCIsXHJcblwiQWwtTXVuYWZpcXVuIChUaGUgSHlwb2NyaXRlcylcIixcclxuXCJBdC1UYWdoYWJ1biAoVGhlIE1hbmlmZXN0YXRpb24gb2YgTG9zc2VzKVwiLFxyXG5cIkF0LVRhbGFxIChEaXZvcmNlKVwiLFxyXG5cIkF0LVRhaHJpbSAoVGhlIFByb2hpYml0aW9uKVwiLFxyXG5cIkFsLU11bGsgKFRoZSBLaW5nZG9tKVwiLFxyXG5cIkFsLVFhbGFtIChUaGUgUGVuKVwiLFxyXG5cIkFsLUhhcXFhaCAoVGhlIFN1cmUgVHJ1dGgpXCIsXHJcblwiQWwtTWEnYXJpaiAoVGhlIFdheXMgb2YgQXNjZW50KVwiLFxyXG5cIk51aCAoTm9haClcIixcclxuXCJBbC1KaW5uIChUaGUgSmlubilcIixcclxuXCJBbC1NdXp6YW1taWwgKFRoZSBPbmUgQ292ZXJpbmcgSGltc2VsZilcIixcclxuXCJBbC1NdWRkYXRodGhpciAoVGhlIE9uZSBXcmFwcGluZyBIaW1zZWxmIFVwKVwiLFxyXG5cIkFsLVFpeWFtYWggKFRoZSBSZXN1cnJlY3Rpb24pXCIsXHJcblwiQWwtSW5zYW4gKFRoZSBNYW4pXCIsXHJcblwiQWwtTXVyc2FsYXQgKFRob3NlIFNlbnQgRm9ydGgpXCIsXHJcblwiQW4tTmFiYScgKFRoZSBBbm5vdW5jZW1lbnQpXCIsXHJcblwiQW4tTmF6aSdhdCAoVGhvc2UgV2hvIFllYXJuKVwiLFxyXG5cIidBYmFzYSAoSGUgRnJvd25lZClcIixcclxuXCJBdC1UYWt3aXIgKFRoZSBGb2xkaW5nIFVwKVwiLFxyXG5cIkFsLUluZml0YXIgKFRoZSBDbGVhdmluZylcIixcclxuXCJBdC1UYXRmaWYgKERlZmF1bHQgaW4gRHV0eSlcIixcclxuXCJBbC1JbnNoaXFhcSAoVGhlIEJ1cnN0aW5nIEFzdW5kZXIpXCIsXHJcblwiQWwtQnVydWogKFRoZSBTdGFycylcIixcclxuXCJBdC1UYXJpcSAoVGhlIENvbWVyIGJ5IE5pZ2h0KVwiLFxyXG5cIkFsLUEnbGEgKFRoZSBNb3N0IEhpZ2gpXCIsXHJcblwiQWwtR2hhc2hpeWFoIChUaGUgT3ZlcndoZWxtaW5nIEV2ZW50KVwiLFxyXG5cIkFsLUZhanIgKFRoZSBEYXlicmVhaylcIixcclxuXCJBbC1CYWxhZCAoVGhlIENpdHkpXCIsXHJcblwiQXNoLVNoYW1zIChUaGUgU3VuKVwiLFxyXG5cIkFsLUxhaWwgKFRoZSBOaWdodClcIixcclxuXCJBZC1EdWhhIChUaGUgQnJpZ2h0bmVzcyBvZiB0aGUgRGF5KVwiLFxyXG5cIkFsLUluc2hpcmFoIChUaGUgRXhwYW5zaW9uKVwiLFxyXG5cIkF0LVRpbiAoVGhlIEZpZylcIixcclxuXCJBbC0nQWxhcSAoVGhlIENsb3QpXCIsXHJcblwiQWwtUWFkciAoVGhlIE1hamVzdHkpXCIsXHJcblwiQWwtQmF5eWluYWggKFRoZSBDbGVhciBFdmlkZW5jZSlcIixcclxuXCJBbC1aaWx6YWwgKFRoZSBTaGFraW5nKVwiLFxyXG5cIkFsLSdBZGl5YXQgKFRoZSBBc3NhdWx0ZXJzKVwiLFxyXG5cIkFsLVFhcmknYWggKFRoZSBDYWxhbWl0eSlcIixcclxuXCJBdC1UYWthdGh1ciAoVGhlIEFidW5kYW5jZSBvZiBXZWFsdGgpXCIsXHJcblwiQWwtJ0FzciAoVGhlIFRpbWUpXCIsXHJcblwiQWwtSHVtYXphaCAoVGhlIFNsYW5kZXJlcilcIixcclxuXCJBbC1GaWwgKFRoZSBFbGVwaGFudClcIixcclxuXCJBbC1RdXJhaXNoIChUaGUgUXVyYWlzaClcIixcclxuXCJBbC1NYSd1biAoQWN0cyBvZiBLaW5kbmVzcylcIixcclxuXCJBbC1LYXV0aGFyIChUaGUgQWJ1bmRhbmNlIG9mIEdvb2QpXCIsXHJcblwiQWwtS2FmaXJ1biAoVGhlIERpc2JlbGlldmVycylcIixcclxuXCJBbi1OYXNyIChUaGUgSGVscClcIixcclxuXCJBbC1MYWhhYiAoVGhlIEZsYW1lKVwiLFxyXG5cIkFsLUlraGxhcyAoVGhlIFVuaXR5KVwiLFxyXG5cIkFsLUZhbGFxIChUaGUgRGF3bilcIixcclxuXCJBbi1OYXMgKFRoZSBNZW4pXCJcclxuXTtcclxuXHJcblxyXG5cclxuLy8wMDEtMTE0XHJcbi8vaHR0cDovL3d3dy5xdXJhbmRvd25sb2FkLmNvbS9saXN0ZW4tdG8tcXVyYW4taW4teW91ci1sYW5ndWFnZS91cmR1LXRyYW5zbGF0aW9uLzAwMS5tcDMiXX0=