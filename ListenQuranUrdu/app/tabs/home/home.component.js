"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_audio_1 = require("nativescript-audio");
var application_settings_1 = require("application-settings");
var HomeComponent = /** @class */ (function () {
    // private totalTrackTime = "0";
    function HomeComponent() {
        this.urduLink = 'http://www.qurandownload.com/listen-to-quran-in-your-language/urdu-translation/001.mp3';
        this.currentSura = "<no sura selected>";
        this.duration = "0";
        this.showPlaying = true;
        this.showLoop = false;
        this.totalDuration = "0";
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
            //this.totalTrackTime = (this.totalTrackTime / (1000*60)%60);
            console.log("onTapItem:totalTrackTimenNP:" + _this.totalDuration);
            //this.totalDuration = this.totalDuration;
            application_settings_1.setString("totalDuration", _this.totalDuration);
        }, 2000);
        setTimeout(function (x) {
            _this.totalDuration = application_settings_1.getString("totalDuration");
        }, 1000);
        //(Number(duration) / (1000 * 60) % 60)         
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
                _this.totalDuration = _this.millisToMinutesAndSeconds(duration);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNDQUEyRTtBQUMzRSx5REFBK0M7QUFFL0MsNkRBQXlHO0FBVXpHO0lBVUcsZ0NBQWdDO0lBRS9CO1FBVkEsYUFBUSxHQUFXLHdGQUF3RixDQUFDO1FBR3JHLGdCQUFXLEdBQUcsb0JBQW9CLENBQUM7UUFDbkMsYUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNmLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsa0JBQWEsR0FBRyxHQUFHLENBQUM7UUFLdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFFaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsSUFBSSxLQUFLLEdBQVEsS0FBSyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQSxDQUFDLDZCQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FDeEIsQ0FBQztZQUNHLEtBQUssR0FBRyxnQ0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxJQUFJLENBQVEsQ0FBQztRQUNiLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDVixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQyxFQUFFLENBQUEsQ0FBQyw2QkFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQzNCLENBQUM7WUFDRyxJQUFJLENB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LHNCQUFzQjtJQUN0Qix1QkFBdUI7SUFDdkIscUJBQXFCO0lBQ3JCLGtCQUFrQjtDQUNqQixDQUFDO0FBSUYsU0FBUztBQUNULHdGQUF3RiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCxDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSAgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBUTlNQbGF5ZXIgfSBmcm9tICduYXRpdmVzY3JpcHQtYXVkaW8nO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gXCJ1aS9sYWJlbFwiO1xyXG5pbXBvcnQgeyBnZXROdW1iZXIsIHNldE51bWJlciwgZ2V0U3RyaW5nLCBzZXRTdHJpbmcsIGhhc0tleSwgcmVtb3ZlLCBjbGVhciB9IGZyb20gXCJhcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjsgXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiBcIkhvbWVcIixcclxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2hvbWUuY29tcG9uZW50Lmh0bWxcIixcclxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgSG9tZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7ICBcclxuXHJcbiAgICB1cmR1TGluazogc3RyaW5nID0gJ2h0dHA6Ly93d3cucXVyYW5kb3dubG9hZC5jb20vbGlzdGVuLXRvLXF1cmFuLWluLXlvdXItbGFuZ3VhZ2UvdXJkdS10cmFuc2xhdGlvbi8wMDEubXAzJzsgICAgXHJcbiAgICBwcml2YXRlIF9wbGF5ZXI6IFROU1BsYXllcjtcclxuICAgIHB1YmxpYyBzdXJhczogQXJyYXk8U3VyYT47XHJcbiAgICBwdWJsaWMgY3VycmVudFN1cmEgPSBcIjxubyBzdXJhIHNlbGVjdGVkPlwiO1xyXG4gICAgcHVibGljIGR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICBwdWJsaWMgc2hvd1BsYXlpbmcgPSB0cnVlO1xyXG4gICAgcHVibGljIHNob3dMb29wID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgdG90YWxEdXJhdGlvbiA9IFwiMFwiO1xyXG4gICAvLyBwcml2YXRlIHRvdGFsVHJhY2tUaW1lID0gXCIwXCI7XHJcbiAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLnN1cmFzID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdXJhTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnN1cmFzLnB1c2gobmV3IFN1cmEoc3VyYUxpc3RbaV0pKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGxldCBuX3N0cjogYW55ID0gXCIwMDFcIjtcclxuICAgICAgICBpZihoYXNLZXkoXCJzdXJhTnVtYmVyXCIpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbl9zdHIgPSBnZXRTdHJpbmcoXCJzdXJhTnVtYmVyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbjpudW1iZXI7XHJcbiAgICAgICAgbiA9IG5fc3RyO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN1cmEgPSBuX3N0ciArIFwiOlwiICsgc3VyYUxpc3Rbbi0xXTsgICAgXHJcblxyXG4gICAgICAgIGlmKGhhc0tleShcInRvdGFsRHVyYXRpb25cIikpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJ0b3RhbER1cmF0aW9uXCIpO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcGxheWVyID0gbmV3IFROU1BsYXllcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RyYWNrQ29tcGxldGUoYXJnczogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3JlZmVyZW5jZSBiYWNrIHRvIHBsYXllcjonLCBhcmdzLnBsYXllcik7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuc2hvd0xvb3ApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRQbGF5KHRoaXMuY3VycmVudFN1cmEpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BsYXllci5zZWVrVG8oMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSB0cnVlOyAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gXHJcbiAgICBwcml2YXRlIF90cmFja0Vycm9yKGFyZ3M6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWZlcmVuY2UgYmFjayB0byBwbGF5ZXI6JywgYXJncy5wbGF5ZXIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGUgZXJyb3I6JywgYXJncy5lcnJvcik7XHJcbiAgICAgICAgYWxlcnQoXCJFcnJvcjpcIisgYXJncy5lcnJvcik7XHJcbiBcclxuICAgICAgICAvLyBBbmRyb2lkIG9ubHk6IGV4dHJhIGRldGFpbCBvbiBlcnJvclxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdleHRyYSBpbmZvIG9uIHRoZSBlcnJvcjonLCBhcmdzLmV4dHJhKTtcclxuICAgIH1cclxuXHJcbiAgIFxyXG4gICAgcHVibGljIHRvZ2dsZVBsYXkoKSB7XHJcbiAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX3BsYXllcik7XHJcbiAgICAgICAgaWYodGhpcy5fcGxheWVyID09IHVuZGVmaW5lZCAmJiB0aGlzLnNob3dQbGF5aW5nKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBuOmFueSA9IHRoaXMuY3VycmVudFN1cmEuc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTsgICBcclxuICAgICAgICAgICAgbGV0IG5fc3RyID0gdGhpcy5wcmVmaXhOYnIobik7XHJcbiAgICAgICAgICAgIHRoaXMucGxheUF1ZGlvKG5fc3RyKTsgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb24gPSBcIjBcIjtcclxuICAgICAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLnNob3dQbGF5aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBsYXkoKTsgIFxyXG4gICAgICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgICAgIC8vdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwiY3VycmVudFRvdGFsRHVyYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNob3dQbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWVyLnBhdXNlKCk7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0TnVtYmVyKFwiY3VycmVudFRpbWVcIiwgdGhpcy5fcGxheWVyLmN1cnJlbnRUaW1lKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICBcclxuICAgIHB1YmxpYyBuZXh0UGxheShhcmdzKSB7XHJcblxyXG4gICAgICAgIGxldCBuOm51bWJlciA9IGFyZ3Muc3BsaXQoXCI6XCIpWzBdLnRyaW0oKTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIG4rKztcclxuICAgICAgICBpZiAobiA+IDExNCkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgXHJcbiAgICAgICAgbGV0IG5fc3RyID0gdGhpcy5wcmVmaXhOYnIobik7XHJcbiAgICAgICAgdGhpcy5fcGxheWVyLmRpc3Bvc2UoKS50aGVuKChkaXNwb3NlZCkgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYElzRGlzcG9zZWQ6YCwgZGlzcG9zZWQpOyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuX3N0cik7ICBcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKTsgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdXJhID0gbl9zdHIgKyBcIjpcIiArIHN1cmFMaXN0W24tMV07IC8vaW5kZXggMCAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXZQbGF5KGFyZ3MpIHtcclxuXHJcbiAgICAgICAgbGV0IG46bnVtYmVyID0gYXJncy5zcGxpdChcIjpcIilbMF0udHJpbSgpOyAgICAgICAgXHJcbiAgICAgICAgbi0tO1xyXG4gICAgICAgIGlmIChuIDwgMSkgXHJcbiAgICAgICAgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBcclxuICAgICAgICBsZXQgbl9zdHIgPSB0aGlzLnByZWZpeE5icihuKTsgLy9hdHRhY2ggMCBmeC4gMDAxIG9yIDAxMFxyXG4gICAgICAgIHRoaXMuY3VycmVudFN1cmEgPSBuX3N0ciArIFwiOlwiICsgc3VyYUxpc3Rbbi0xXTsgLy9pbmRleCAwICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcGxheWVyLmRpc3Bvc2UoKS50aGVuKChkaXNwb3NlZCkgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgSXNEaXNwb3NlZDpgLCBkaXNwb3NlZCk7ICAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMucGxheUF1ZGlvKG5fc3RyKTsgICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvd1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gXCIwXCI7XHJcbiAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvbkl0ZW1UYXAoYXJncykge1xyXG4gICAgXHJcbiAgICAgICAgbGV0IG46IG51bWJlcjtcclxuICAgICAgICBuID0gIGFyZ3MuaW5kZXg7XHJcbiAgICAgICAgbiA9IG4gPT0gdW5kZWZpbmVkID8gYXJncyA6IG47XHJcbiAgICAgICAgbisrO1xyXG4gICAgICAgIGxldCBuX3N0cjpzdHJpbmcgPSB0aGlzLnByZWZpeE5icihuKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3VyYSA9IG5fc3RyICsgXCI6XCIgKyBzdXJhTGlzdFthcmdzLmluZGV4XTtcclxuICAgICAgICB0aGlzLnBsYXlBdWRpbyhuX3N0cik7ICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zaG93UGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBcIjBcIjtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwib25UYXBJdGVtOnRvdGFsZHVyYXRpb246XCIgKyBnZXRTdHJpbmcoXCJjdXJyZW50VG90YWxEdXJhdGlvblwiKSk7IFxyXG4gICAgICAgIHNldFRpbWVvdXQoIHggPT4geyBcclxuICAgICAgICAgICAgLy90aGlzLnRvdGFsVHJhY2tUaW1lID0gKHRoaXMudG90YWxUcmFja1RpbWUgLyAoMTAwMCo2MCklNjApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uVGFwSXRlbTp0b3RhbFRyYWNrVGltZW5OUDpcIiArIHRoaXMudG90YWxEdXJhdGlvbik7IFxyXG4gICAgICAgICAgICAvL3RoaXMudG90YWxEdXJhdGlvbiA9IHRoaXMudG90YWxEdXJhdGlvbjtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNldFN0cmluZyhcInRvdGFsRHVyYXRpb25cIiwgdGhpcy50b3RhbER1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgfSwgMjAwMCk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoIHggPT4geyBcclxuICAgICAgICAgICAgdGhpcy50b3RhbER1cmF0aW9uID0gZ2V0U3RyaW5nKFwidG90YWxEdXJhdGlvblwiKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAvLyhOdW1iZXIoZHVyYXRpb24pIC8gKDEwMDAgKiA2MCkgJSA2MCkgICAgICAgICBcclxuICAgfVxyXG5cclxuICAgXHJcbiAgICBwdWJsaWMgcGxheUF1ZGlvKG5fc3RyKSBcclxuICAgIHsgIFxyXG4gICAgICAgY29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKlwiKTtcclxuICAgICAgIGxldCBuOiBudW1iZXI7ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgc2V0U3RyaW5nKFwic3VyYU51bWJlclwiLG5fc3RyKTsgICAgICAgXHJcbiAgICAgICB0aGlzLl9wbGF5ZXIuaW5pdEZyb21Vcmwoe1xyXG4gICAgICAgYXVkaW9GaWxlOiAnaHR0cDovL3d3dy5xdXJhbmRvd25sb2FkLmNvbS9saXN0ZW4tdG8tcXVyYW4taW4teW91ci1sYW5ndWFnZS91cmR1LXRyYW5zbGF0aW9uLycrbl9zdHIrJy5tcDMnLCAvLyB+ID0gYXBwIGRpcmVjdG9yeVxyXG4gICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICBjb21wbGV0ZUNhbGxiYWNrOiB0aGlzLl90cmFja0NvbXBsZXRlLmJpbmQodGhpcyksICAgICAgICBcclxuICAgICAgIGVycm9yQ2FsbGJhY2s6IHRoaXMuX3RyYWNrRXJyb3IuYmluZCh0aGlzKVxyXG4gICB9KS50aGVuKCgpID0+IHtcclxuXHJcbiAgICAgICAgdGhpcy5fcGxheWVyLnBsYXkoKS50aGVuKChwbGF5aW5nKSA9PiB7ICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYFBsYXlpbmc6YCwgcGxheWluZyk7ICAgICAgICAgICBcclxuICAgIH0pXHJcbiAgICB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9wbGF5ZXIuZ2V0QXVkaW9UcmFja0R1cmF0aW9uKCkudGhlbigoZHVyYXRpb24pID0+IHsgIFxyXG4gICAgICAgIHRoaXMudG90YWxEdXJhdGlvbiA9IHRoaXMubWlsbGlzVG9NaW51dGVzQW5kU2Vjb25kcyhkdXJhdGlvbik7ICBcclxuICAgICBcclxuICAgIH0pXHJcbiAgIH0pOyAgXHJcbiAgIH1cclxuXHJcbiAgIHB1YmxpYyBtaWxsaXNUb01pbnV0ZXNBbmRTZWNvbmRzKG1pbGxpcykge1xyXG4gICAgICBcclxuICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcihtaWxsaXMgLyA2MDAwMCk7XHJcbiAgICBsZXQgIHNlY29uZHMgPSAoKG1pbGxpcyAlIDYwMDAwKSAvIDEwMDApLnRvRml4ZWQoMCk7XHJcbiAgICBsZXQgcmVzdWx0ID0gbWludXRlcyArIFwiOlwiICsgKE51bWJlcihzZWNvbmRzKSA8IDEwID8gJzAnIDogJycpICsgc2Vjb25kcztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gXHJcbiAgIHB1YmxpYyBwcmVmaXhOYnIobik6IHN0cmluZ1xyXG4gICB7XHJcbiAgICAgICBsZXQgbl9zdHI6c3RyaW5nID0gbi50b1N0cmluZygpO1xyXG4gICAgICAgaWYgKG4udG9TdHJpbmcoKS5sZW5ndGggPT0gMSlcclxuICAgICAgIHtcclxuICAgICAgICAgIG5fc3RyID0gXCIwMFwiK24udG9TdHJpbmcoKTsgIFxyXG4gICAgICAgfSBlbHNlIGlmKG4udG9TdHJpbmcoKS5sZW5ndGggPT0gMilcclxuICAgICAgIHtcclxuICAgICAgICAgIG5fc3RyID0gXCIwXCIrbi50b1N0cmluZygpOyAgXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlXHJcbiAgICAgICB7XHJcbiAgICAgICAgICBuX3N0ciA9IG4udG9TdHJpbmcoKTtcclxuICAgICAgIH1cclxuICAgICAgcmV0dXJuIG5fc3RyO1xyXG4gICB9XHJcblxyXG4gICBwdWJsaWMgbG9vcEFsbCgpIFxyXG4gICB7XHJcbiAgICAgICB0aGlzLnNob3dMb29wID0gIXRoaXMuc2hvd0xvb3AgPyB0cnVlIDogZmFsc2U7XHJcbiAgIH1cclxuICAgIHB1YmxpYyBkZWxheShtczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbiAgICB9XHJcbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICogVXNlIHRoZSBcIm5nT25Jbml0XCIgaGFuZGxlciB0byBpbml0aWFsaXplIGRhdGEgZm9yIHRoZSB2aWV3LlxyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAgICAgLy90aGlzLnRvdGFsRHVyYXRpb24gPSBcIjBcIjtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG4vL2ludGVybmFsIGNsYXNzXHJcbmNsYXNzIFN1cmEge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykgeyB9XHJcbn1cclxuXHJcbi8vbmFtZXMgb2YgYWxsIHN1cmFzJ1xyXG5sZXQgc3VyYUxpc3QgPSBbXHJcbiAgICBcIkFsLUZhdGloYWggKFRoZSBPcGVuaW5nKVwiLFxyXG5cIkFsLUJhcWFyYWggKFRoZSBDb3cpXCIsXHJcblwiQWwtJ0ltcmFuIChUaGUgRmFtaWx5IG9mIEFtcmFuKVwiLFxyXG5cIkFuLU5pc2EnIChUaGUgV29tZW4pXCIsXHJcblwiQWwtTWEnaWRhaCAoVGhlIEZvb2QpXCIsXHJcblwiQWwtQW4nYW0gKFRoZSBDYXR0bGUpXCIsXHJcblwiQWwtQSdyYWYgKFRoZSBFbGV2YXRlZCBQbGFjZXMpXCIsXHJcblwiQWwtQW5mYWwgKFZvbHVudGFyeSBHaWZ0cylcIixcclxuXCJBbC1CYXJhJ2F0IC8gQXQtVGF1YmFoKFRoZSBJbW11bml0eSlcIixcclxuXCJZdW51cyAoSm9uYWgpXCIsXHJcblwiSHVkIChIdWQpXCIsXHJcblwiWXVzdWYgKEpvc2VwaClcIixcclxuXCJBci1SYSdkIChUaGUgVGh1bmRlcilcIixcclxuXCJJYnJhaGltIChBYnJhaGFtKVwiLFxyXG5cIkFsLUhpanIgKFRoZSBSb2NrKVwiLFxyXG5cIkFuLU5haGwgKFRoZSBCZWUpXCIsXHJcblwiQmFuaSBJc3JhJ2lsIChUaGUgSXNyYWVsaXRlcylcIixcclxuXCJBbC1LYWhmIChUaGUgQ2F2ZSlcIixcclxuXCJNYXJ5YW0gKE1hcnkpXCIsXHJcblwiVGEgSGEgKFRhIEhhKVwiLFxyXG5cIkFsLUFuYml5YScgKFRoZSBQcm9waGV0cylcIixcclxuXCJBbC1IYWpqIChUaGUgUGlsZ3JpbWFnZSlcIixcclxuXCJBbC1NdSdtaW51biAoVGhlIEJlbGlldmVycylcIixcclxuXCJBbi1OdXIgKFRoZSBMaWdodClcIixcclxuXCJBbC1GdXJxYW4gKFRoZSBEaXNjcmltaW5hdGlvbilcIixcclxuXCJBc2gtU2h1J2FyYScgKFRoZSBQb2V0cylcIixcclxuXCJBbi1OYW1sIChUaGUgTmFtbClcIixcclxuXCJBbC1RYXNhcyAoVGhlIE5hcnJhdGl2ZSlcIixcclxuXCJBbC0nQW5rYWJ1dCAoVGhlIFNwaWRlcilcIixcclxuXCJBci1SdW0gKFRoZSBSb21hbnMpXCIsXHJcblwiTHVxbWFuIChMdXFtYW4pXCIsXHJcblwiQXMtU2FqZGFoIChUaGUgQWRvcmF0aW9uKVwiLFxyXG5cIkFsLUFoemFiIChUaGUgQWxsaWVzKVwiLFxyXG5cIkFsLVNhYmEnIChUaGUgU2FiYScpXCIsXHJcblwiQWwtRmF0aXIgKFRoZSBPcmlnaW5hdG9yKVwiLFxyXG5cIllhIFNpbiAoWWEgU2luKVwiLFxyXG5cIkFzLVNhZmZhdCAoVGhvc2UgUmFuZ2luZyBpbiBSYW5rcylcIixcclxuXCJTYWQgKFNhZClcIixcclxuXCJBei1adW1hciAoVGhlIENvbXBhbmllcylcIixcclxuXCJBbC1NdSdtaW4gKFRoZSBCZWxpZXZlcilcIixcclxuXCJIYSBNaW0gKEhhIE1pbSlcIixcclxuXCJBc2gtU2h1cmEgKENvdW5zZWwpXCIsXHJcblwiQXotWnVraHJ1ZiAoR29sZClcIixcclxuXCJBZC1EdWtoYW4gKFRoZSBEcm91Z2h0KVwiLFxyXG5cIkFsLUphdGhpeWFoIChUaGUgS25lZWxpbmcpXCIsXHJcblwiQWwtQWhxYWYgKFRoZSBTYW5kaGlsbHMpXCIsXHJcblwiTXVoYW1tYWQgKE11aGFtbWFkKVwiLFxyXG5cIkFsLUZhdGggKFRoZSBWaWN0b3J5KVwiLFxyXG5cIkFsLUh1anVyYXQgKFRoZSBBcGFydG1lbnRzKVwiLFxyXG5cIlFhZiAoUWFmKVwiLFxyXG5cIkFkLURoYXJpeWF0IChUaGUgU2NhdHRlcmVycylcIixcclxuXCJBdC1UdXIgKFRoZSBNb3VudGFpbilcIixcclxuXCJBbi1OYWptIChUaGUgU3RhcilcIixcclxuXCJBbC1RYW1hciAoVGhlIE1vb24pXCIsXHJcblwiQXItUmFobWFuIChUaGUgQmVuZWZpY2VudClcIixcclxuXCJBbC1XYXFpJ2FoIChUaGUgRXZlbnQpXCIsXHJcblwiQWwtSGFkaWQgKElyb24pXCIsXHJcblwiQWwtTXVqYWRpbGFoIChUaGUgUGxlYWRpbmcgV29tYW4pXCIsXHJcblwiQWwtSGFzaHIgKFRoZSBCYW5pc2htZW50KVwiLFxyXG5cIkFsLU11bXRhaGFuYWggKFRoZSBXb21hbiB3aG8gaXMgRXhhbWluZWQpXCIsXHJcblwiQXMtU2FmZiAoVGhlIFJhbmtzKVwiLFxyXG5cIkFsLUp1bXUnYWggKFRoZSBDb25ncmVnYXRpb24pXCIsXHJcblwiQWwtTXVuYWZpcXVuIChUaGUgSHlwb2NyaXRlcylcIixcclxuXCJBdC1UYWdoYWJ1biAoVGhlIE1hbmlmZXN0YXRpb24gb2YgTG9zc2VzKVwiLFxyXG5cIkF0LVRhbGFxIChEaXZvcmNlKVwiLFxyXG5cIkF0LVRhaHJpbSAoVGhlIFByb2hpYml0aW9uKVwiLFxyXG5cIkFsLU11bGsgKFRoZSBLaW5nZG9tKVwiLFxyXG5cIkFsLVFhbGFtIChUaGUgUGVuKVwiLFxyXG5cIkFsLUhhcXFhaCAoVGhlIFN1cmUgVHJ1dGgpXCIsXHJcblwiQWwtTWEnYXJpaiAoVGhlIFdheXMgb2YgQXNjZW50KVwiLFxyXG5cIk51aCAoTm9haClcIixcclxuXCJBbC1KaW5uIChUaGUgSmlubilcIixcclxuXCJBbC1NdXp6YW1taWwgKFRoZSBPbmUgQ292ZXJpbmcgSGltc2VsZilcIixcclxuXCJBbC1NdWRkYXRodGhpciAoVGhlIE9uZSBXcmFwcGluZyBIaW1zZWxmIFVwKVwiLFxyXG5cIkFsLVFpeWFtYWggKFRoZSBSZXN1cnJlY3Rpb24pXCIsXHJcblwiQWwtSW5zYW4gKFRoZSBNYW4pXCIsXHJcblwiQWwtTXVyc2FsYXQgKFRob3NlIFNlbnQgRm9ydGgpXCIsXHJcblwiQW4tTmFiYScgKFRoZSBBbm5vdW5jZW1lbnQpXCIsXHJcblwiQW4tTmF6aSdhdCAoVGhvc2UgV2hvIFllYXJuKVwiLFxyXG5cIidBYmFzYSAoSGUgRnJvd25lZClcIixcclxuXCJBdC1UYWt3aXIgKFRoZSBGb2xkaW5nIFVwKVwiLFxyXG5cIkFsLUluZml0YXIgKFRoZSBDbGVhdmluZylcIixcclxuXCJBdC1UYXRmaWYgKERlZmF1bHQgaW4gRHV0eSlcIixcclxuXCJBbC1JbnNoaXFhcSAoVGhlIEJ1cnN0aW5nIEFzdW5kZXIpXCIsXHJcblwiQWwtQnVydWogKFRoZSBTdGFycylcIixcclxuXCJBdC1UYXJpcSAoVGhlIENvbWVyIGJ5IE5pZ2h0KVwiLFxyXG5cIkFsLUEnbGEgKFRoZSBNb3N0IEhpZ2gpXCIsXHJcblwiQWwtR2hhc2hpeWFoIChUaGUgT3ZlcndoZWxtaW5nIEV2ZW50KVwiLFxyXG5cIkFsLUZhanIgKFRoZSBEYXlicmVhaylcIixcclxuXCJBbC1CYWxhZCAoVGhlIENpdHkpXCIsXHJcblwiQXNoLVNoYW1zIChUaGUgU3VuKVwiLFxyXG5cIkFsLUxhaWwgKFRoZSBOaWdodClcIixcclxuXCJBZC1EdWhhIChUaGUgQnJpZ2h0bmVzcyBvZiB0aGUgRGF5KVwiLFxyXG5cIkFsLUluc2hpcmFoIChUaGUgRXhwYW5zaW9uKVwiLFxyXG5cIkF0LVRpbiAoVGhlIEZpZylcIixcclxuXCJBbC0nQWxhcSAoVGhlIENsb3QpXCIsXHJcblwiQWwtUWFkciAoVGhlIE1hamVzdHkpXCIsXHJcblwiQWwtQmF5eWluYWggKFRoZSBDbGVhciBFdmlkZW5jZSlcIixcclxuXCJBbC1aaWx6YWwgKFRoZSBTaGFraW5nKVwiLFxyXG5cIkFsLSdBZGl5YXQgKFRoZSBBc3NhdWx0ZXJzKVwiLFxyXG5cIkFsLVFhcmknYWggKFRoZSBDYWxhbWl0eSlcIixcclxuXCJBdC1UYWthdGh1ciAoVGhlIEFidW5kYW5jZSBvZiBXZWFsdGgpXCIsXHJcblwiQWwtJ0FzciAoVGhlIFRpbWUpXCIsXHJcblwiQWwtSHVtYXphaCAoVGhlIFNsYW5kZXJlcilcIixcclxuXCJBbC1GaWwgKFRoZSBFbGVwaGFudClcIixcclxuXCJBbC1RdXJhaXNoIChUaGUgUXVyYWlzaClcIixcclxuXCJBbC1NYSd1biAoQWN0cyBvZiBLaW5kbmVzcylcIixcclxuXCJBbC1LYXV0aGFyIChUaGUgQWJ1bmRhbmNlIG9mIEdvb2QpXCIsXHJcblwiQWwtS2FmaXJ1biAoVGhlIERpc2JlbGlldmVycylcIixcclxuXCJBbi1OYXNyIChUaGUgSGVscClcIixcclxuXCJBbC1MYWhhYiAoVGhlIEZsYW1lKVwiLFxyXG5cIkFsLUlraGxhcyAoVGhlIFVuaXR5KVwiLFxyXG5cIkFsLUZhbGFxIChUaGUgRGF3bilcIixcclxuXCJBbi1OYXMgKFRoZSBNZW4pXCJcclxuXTtcclxuXHJcblxyXG5cclxuLy8wMDEtMTE0XHJcbi8vaHR0cDovL3d3dy5xdXJhbmRvd25sb2FkLmNvbS9saXN0ZW4tdG8tcXVyYW4taW4teW91ci1sYW5ndWFnZS91cmR1LXRyYW5zbGF0aW9uLzAwMS5tcDMiXX0=