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
		var costExp1 = BigNumber.from("1e100").log2() / BigNumber.from(88);
		var costExp2 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp3 = BigNumber.from("1e100").log2() / BigNumber.from(14699);
		var costExp4 = BigNumber.from("1e100").log2() / BigNumber.from(133976);
		var costExp5 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp6 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp7 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp8 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp9 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp10 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		let getDesc = (level) => "r_1=" + getr1(level).toString(0);
		//r1 = theory.createUpgrade(1, currency, new ExponentialCost(1,BigNumber.from("1.65282744595332527e-6"))); //exponential cost to reach 1e1000
		r1 = theory.createUpgrade(1, currency, new CompositeCost(89,new ExponentialCost(1, costExp1),
											   new CompositeCost(1381,new ExponentialCost(BigNumber.from("1e100") * BigNumber.TWO.pow(costExp2), costExp2),
											   new CompositeCost(14701,new ExponentialCost(BigNumber.from("1e200") * BigNumber.TWO.pow(costExp3), costExp3),
											   new CompositeCost(133979,new ExponentialCost(BigNumber.from("1e300") * BigNumber.TWO.pow(costExp4), costExp4),
											   new CompositeCost(89,new ExponentialCost(BigNumber.from("1e400") * BigNumber.TWO.pow(costExp5), costExp5),
											   new CompositeCost(89,new ExponentialCost(BigNumber.from("1e500") * BigNumber.TWO.pow(costExp6), costExp6),
											   new CompositeCost(89,new ExponentialCost(BigNumber.from("1e600") * BigNumber.TWO.pow(costExp7), costExp7),
											   new CompositeCost(89,new ExponentialCost(BigNumber.from("1e700") * BigNumber.TWO.pow(costExp8), costExp8),
											   new CompositeCost(89,new ExponentialCost(BigNumber.from("1e800") * BigNumber.TWO.pow(costExp9), costExp9),
											   new ExponentialCost(BigNumber.from("1e900") * BigNumber.TWO.pow(costExp10), costExp10)))))))))));
		r1.getDescription = (_) => Utils.getMath(getDesc(r1.level));
		r1.getInfo = (amount) => Utils.getMathTo(getDesc(r1.level), getDesc(r1.level + amount));
		//r1.boughtOrRefunded = (_) => theory.clearGraph();
	}
    
	
	// R
	{
		let getDesc = (level) => "R=" + getR(level).toString(0);
		//R = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10,3.321928094887)));
		R = theory.createUpgrade(0, currency, new FirstFreeCost(new CustomCost((level) => BigNumber.from(1.01) * r1.cost.getCost(parseInt(getR(level + 1).toString(0,0,Rounding.NEAREST)) - 2))));
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
		//var unscaledY = ((Rv - r1v) * (t * r1v / Rv).cos() + r2v * (t * (BigNumber.ONE - r1v/Rv)).cos());
		//var unscaledZ = ((Rv - r1v) * (t * r1v / Rv).sin() - r2v * (t * (BigNumber.ONE - r1v/Rv)).sin());
		var unscaledY = ((Rv - r1v) * (t).cos() + r2v * (t * (Rv - r1v)/r1v).cos());
		var unscaledZ = ((Rv - r1v) * (t).sin() - r2v * (t * (Rv - r1v)/r1v).sin());
		state.y = (scalar * unscaledY).toNumber();
		state.z = (scalar * unscaledZ).toNumber();
		rhodot = r1v * r2v * Rv * (unscaledY * unscaledY + unscaledZ * unscaledZ).sqrt() / BigNumber.from(GCD(parseInt(Rv.toString(0,0,Rounding.NEAREST)), parseInt(r1v.toString(0,0,Rounding.NEAREST))));
		currency.value += dt * rhodot;
	}
	
	theory.invalidateTertiaryEquation();
}

var getPrimaryEquation = () => {
	theory.primaryEquationHeight = 75;
	theory.primaryEquationScale = .9;
    let result = "\\dot{\\rho}=\\frac{r_1 r_2 R\\sqrt{x^2+y^2}}{gcd(r_1, R)}" +
	"\\qquad \\begin{matrix} x=L\\cos(\\theta) + r_2\\cos(\\theta L r_1^{-1} )\\\\" +
	"y=L\\sin(\\theta) - r_2\\sin(\\theta L r_1^{-1}) \\end{matrix}";
    return result;
}

var getSecondaryEquation = () => {
	theory.secondaryEquationHeight = 300;
	theory.secondaryEquationScale = 1;
	return "";//\\\\" + 
		   //""; //(\\sin(\\pi\\frac{t}{500})+1)";
}

var getTertiaryEquation = () => {
	return "L=(R-r_1),r_2=.5r_1, \\theta =" + t.toString(2) +
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
var getr2 = () => getr1(r1.level) * .5;//getr1(r1.level) * ((BigNumber.PI * t / BigNumber.from(500)).sin() + BigNumber.ONE);
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