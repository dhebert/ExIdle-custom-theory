import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "spi_ro_graph_id";
var name = "Spirograph";
var description = "Swirly picture go brr";
var authors = "EdgeOfDreams";
var version = 1;

var currency;
var c1Exp, c2Exp;

var achievement1, achievement2;
var chapter1, chapter2;

var swizzles = [(v) => new Vector3(v.y, v.z, v.x),
                (v) => new Vector3(v.y, v.z, v.x),
                (v) => new Vector3(v.x, v.y, v.z)];
				
var state = new Vector3(0, 0, 0);

var center = new Vector3(0, 0, 0);

var scale = 1;

var R, r1, r2;
var t;
var scalar = .1;
var rhodot = BigNumber.ZERO;

var firstHundredPrimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,
73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,
179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,
283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,
419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541]

var RLevels = [1,
2,4,6,
12,18,24,30,
60,90,120,150,180,210,
420,630,840,1050,1260,1470,1680,1890,2100,2310,
4620,6930,9240,11550,13860,16170,18480,20790,23100,25410,27720,30030
]

var alwaysShowRefundButtons = () => true;

var init = () => {
	t = BigNumber.ONE;
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // r1
	{
		let getDesc = (level) => "r_1=" + getr1(level).toString(2);
		r1 = theory.createUpgrade(1, currency, new ExponentialCost(1,BigNumber.from("1.65282744595332527e-6")));
		r1.getDescription = (_) => Utils.getMath(getDesc(r1.level));
		r1.getInfo = (amount) => Utils.getMathTo(getDesc(r1.level), getDesc(r1.level + amount));
		//r1.boughtOrRefunded = (_) => theory.clearGraph();
	}
    
	
	// R
	{
		let getDesc = (level) => "R=" + getR(level).toString(2);
		R = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10,3.321928094887)));
		R.getDescription = (_) => Utils.getMath(getDesc(R.level));
		R.getInfo = (amount) => Utils.getMathTo(getDesc(R.level), getDesc(R.level + amount));
		R.maxLevel = 100;
		R.boughtOrRefunded = (_) => {
			theory.clearGraph();
		}
	}


    updateAvailability();
}

var updateAvailability = () => {
    //c2Exp.isAvailable = c1Exp.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
									
	t = t + dt;
	
	var Rv = getR(R.level);
	var r1v = getr1(r1.level);
	var r2v = getr2();
	
	
	//state.x = scalar * ((R - r) * BigNumber.from((t * 5) * r / R).sin().toNumber() - a * BigNumber.from((t * 5) * (1 - r/R)).sin().toNumber());
	if (Rv != BigNumber.ZERO)
	{
		scalar = (BigNumber.ONE / (BigNumber.TWO * Rv));
		var unscaledY = ((Rv - r1v) * (t * r1v / Rv).cos() + r2v * (t * (BigNumber.ONE - r1v/Rv)).cos());
		var unscaledZ = ((Rv - r1v) * (t * r1v / Rv).sin() - r2v * (t * (BigNumber.ONE - r1v/Rv)).sin());
		state.y = (scalar * unscaledY).toNumber();
		state.z = (scalar * unscaledZ).toNumber();
		rhodot = r1v * (unscaledY * unscaledY + unscaledZ * unscaledZ).sqrt() / BigNumber.from(GCD(parseInt(Rv.toString(0,0,Rounding.NEAREST)), parseInt(r1v.toString(0,0,Rounding.NEAREST))));
		currency.value += dt * rhodot;
	}
	
	theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () => {
	theory.primaryEquationHeight = 75;
    let result = "\\dot{\\rho}=\\frac{r_1\\sqrt{x^2+y^2}}{GCD(r_1, R)}";
    return result;
}

var getSecondaryEquation = () => {
	theory.secondaryEquationHeight = 100;
	return "x=(R-r_1)\\cos(t\\frac{r_1}{R}) + r_2\\cos(t(1-\\frac{r_1}{R}))\\\\" + 
	       "y=(R-r_1)\\sin(t\\frac{r_1}{R}) + r_2\\sin(t(1-\\frac{r_1}{R}))\\\\" + 
		   "r_2=r_1(\\sin(\\pi\\frac{t}{500})+1)";
}

var getTertiaryEquation = () => {
	return "t=" + t.toString(2) +
                        ",r_2=" + getr2().toString(2) +
						//",x=" + BigNumber.from(state.y).toString(2) +
						//",y=" + BigNumber.from(state.z).toString(2) + 
						",\\dot{\\rho}=" + rhodot.toString(2) + 
						",GCD(R, r1)=" + GCD(parseInt(getR(R.level).toString(0,0,Rounding.NEAREST)), parseInt(getr1(r1.level).toString(0,0,Rounding.NEAREST)));
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get3DGraphPoint = () => swizzles[0]((state - center) * scale);

var getR = (level) => {
	if (level == 0) { return BigNumber.ZERO; }
	if (level == 1) { return BigNumber.ONE; }
	//return BigNumber.TEN.pow(BigNumber.from(level));
	
	var i = 0;
	var k = 0;
	var result = 1;
	while (i < level + 1)
	{		
		var p = firstHundredPrimes[k];
		if (p + i < level)
		{
			result = result * p;
			i += p - 1;
		}
		else
		{
			result = result * (level - i);
			i = level + 1;
		}
		k++;
	}
	return BigNumber.from(result);
}
var getr1 = (level) => BigNumber.from(level + 1);
var getr2 = () => getr1(r1.level) * ((BigNumber.PI * t / BigNumber.from(500)).sin() + BigNumber.ONE);
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

var GCD = (a, b) => {
	var R;
	if (a > b) {var c = a; a = b; b = c;}
	while ((a % b) > 0)
	{
		R = a % b;
		a = b;
		b = R;
	}
	return b;
}

init();