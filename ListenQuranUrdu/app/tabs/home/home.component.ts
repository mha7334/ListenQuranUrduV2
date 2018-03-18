
import { Component, OnInit,ChangeDetectionStrategy  } from "@angular/core";
import { TNSPlayer } from 'nativescript-audio';
import { Label } from "ui/label";
import { getNumber, setNumber, getString, setString, hasKey, remove, clear } from "application-settings";
import * as app from "tns-core-modules/application"; 
import { knownFolders, File, Folder } from "file-system";
import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData, start as applicationStart } from "application";

//check it again
applicationOn(launchEvent, function (args: ApplicationEventData) {
  //
});

//check it again
applicationOn(suspendEvent, function (args: ApplicationEventData) {
   
    if(!this._player.isAudioPlaying)
    {
        this._player.pause();
    }
});

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})



export class HomeComponent implements OnInit {  

    urduLink: string = 'http://www.qurandownload.com/listen-to-quran-in-your-language/urdu-translation/001.mp3';    
    private _player: TNSPlayer;
    public suras: Array<Sura>;
    public currentSura = "<no sura selected>";
    public duration = "0";
    public showPlaying = true;
    public showLoop = false;
    public totalDuration: string = "0";
    public totalMilliSecs = 0;
   
    constructor() {
                
        this.suras = [];
        
        for (let i = 0; i < suraList.length; i++) {
            this.suras.push(new Sura(suraList[i]));
        } 
        let n_str: any = "001";
        if(hasKey("suraNumber"))
        {
            n_str = getString("suraNumber");
        }
        let n:number;
        n = n_str;
        this.currentSura = n_str + ":" + suraList[n-1];    

        if(hasKey("totalDuration"))
        {
            this.totalDuration = getString("totalDuration");
        }    
        
        this._player = new TNSPlayer();
    }

   
    private _trackComplete(args: any) {
        console.log('reference back to player:', args.player);

        if(this.showLoop)
        {
            this.nextPlay(this.currentSura);
        }        
        else
        {
            this._player.seekTo(0);
            this.showPlaying = true;           
        }
    }
 
    private _trackError(args: any) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);
        alert("Error:"+ args.error);
 
        // Android only: extra detail on error
        console.log('extra info on the error:', args.extra);
    }

   
    public togglePlay() {
      
        console.log(this._player);
        if(this._player == undefined && this.showPlaying)
        {

            let n:any = this.currentSura.split(":")[0].trim();   
            let n_str = this.prefixNbr(n);
            this.playAudio(n_str);        
            this.showPlaying = false;
            this.duration = "0";
            //this.totalDuration = getString("currentTotalDuration");
        }
        else if(this.showPlaying) {
            this.showPlaying = false;
            this._player.play();  
            this.duration = "0";
            //this.totalDuration = getString("currentTotalDuration");
        }
        else {            
            this.showPlaying = true;
            this._player.pause();                    
            setNumber("currentTime", this._player.currentTime);                
        }
    }
   
    public nextPlay(args) {

        let n:number = args.split(":")[0].trim();                    
        n++;
        if (n > 114) 
        {
            return;
        } 
      
        let n_str = this.prefixNbr(n);
        this._player.dispose().then((disposed) => {            
                console.log(`IsDisposed:`, disposed);           
            });

        this.playAudio(n_str);  
        this.duration = "0";
        //this.totalDuration = getString("currentTotalDuration");     
        this.showPlaying = false;
        this.currentSura = n_str + ":" + suraList[n-1]; //index 0  
    }

    public prevPlay(args) {

        let n:number = args.split(":")[0].trim();        
        n--;
        if (n < 1) 
        {            
            return;
        } 
        
        let n_str = this.prefixNbr(n); //attach 0 fx. 001 or 010
        this.currentSura = n_str + ":" + suraList[n-1]; //index 0   
        
        this._player.dispose().then((disposed) => {            
            console.log(`IsDisposed:`, disposed);           
        });
          
        this.playAudio(n_str);        
        this.showPlaying = false;
        this.duration = "0";
        //this.totalDuration = getString("currentTotalDuration");
    }
    public onItemTap(args) {
    
        let n: number;
        n =  args.index;
        n = n == undefined ? args : n;
        n++;
        let n_str:string = this.prefixNbr(n);

        this.currentSura = n_str + ":" + suraList[args.index];
        this.playAudio(n_str);            
        this.showPlaying = false;
        //this.duration = "0";
        setTimeout( x => {                                    
            console.log(getString("totalDuration"));
            this.totalDuration = getString("totalDuration");           
        }, 4000);
            
        this.timeout(10);
   }

   
   
   public timeout(times)
   {
    let theLoop: (i: number, delay?) => void = (i: number, delay = 3000) => {
        if (i % 2 === 0) {
            delay = 1500;
        }
    
        setTimeout(() => {
            if (--i) {
                theLoop(i);
                console.log(i);
            }
        }, delay);
    };    
    theLoop(10);
   }

    public playAudio(n_str) 
    {  
       console.log("*****************");
       let n: number;                   
       setString("suraNumber",n_str);       
       this._player.initFromUrl({
       audioFile: 'http://www.qurandownload.com/listen-to-quran-in-your-language/urdu-translation/'+n_str+'.mp3', // ~ = app directory
       loop: false,
       completeCallback: this._trackComplete.bind(this),        
       errorCallback: this._trackError.bind(this)
   }).then(() => {

        this._player.play().then((playing) => {                     
        console.log(`Playing:`, playing);           
    })
    }).then(() => {
        this._player.getAudioTrackDuration().then((duration) => {          
        setString("totalDuration", this.millisToMinutesAndSeconds(duration));
    })
   });  
   }

   public millisToMinutesAndSeconds(millis) {
      
    let minutes = Math.floor(millis / 60000);
    let  seconds = ((millis % 60000) / 1000).toFixed(0);
    let result = minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
    return result;
  }
 
   public prefixNbr(n): string
   {
       let n_str:string = n.toString();
       if (n.toString().length == 1)
       {
          n_str = "00"+n.toString();  
       } else if(n.toString().length == 2)
       {
          n_str = "0"+n.toString();  
       }
       else
       {
          n_str = n.toString();
       }
      return n_str;
   }

   public loopAll() 
   {
       this.showLoop = !this.showLoop ? true : false;
   }
    public delay(ms: number) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ngOnInit(): void {
        /* ***********************************************************
        * Use the "ngOnInit" handler to initialize data for the view.
        *************************************************************/
        //this.totalDuration = "0";
    }
}



//internal class
class Sura {
    constructor(public name: string) { }
}

//names of all suras'
let suraList = [
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