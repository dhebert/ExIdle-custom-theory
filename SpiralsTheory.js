import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "spi_ro_graph_id";
var name = "Spirals Theory";
var description = "Swirly picture go brr";
var authors = "EdgeOfDreams";
var version = 1.4;

var currency;
var r1Exp, r2Exp, RExp, r2VariesWithr1, r2VariesWithTheta;

var achievement1, achievement2;
var chapter1, chapter2;

var swizzles = [(v) => new Vector3(v.y, v.z, v.x),
                (v) => new Vector3(v.y, v.z, v.x),
                (v) => new Vector3(v.x, v.y, v.z)];
				
var state = new Vector3(0, 0, 0);

var center = new Vector3(0, 0, 0);

var scale = 1;

var R, r1, r2, qDot, thetaDot;
var t, qv;
var scalar = .1;
var rhodot = BigNumber.ZERO;
var gcdRr1 = BigNumber.ZERO;
var unscaledY = BigNumber.ZERO;
var unscaledZ = BigNumber.ZERO;
var quaternaryEntries = [];
var enableRefundsUpgrade;

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
	qv = BigNumber.ONE;
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // r1
	{
		var costExp1 = BigNumber.from("1e100").log2() / BigNumber.from(88);
		var costExp2 = BigNumber.from("1e100").log2() / BigNumber.from(1380);
		var costExp3 = BigNumber.from("1e100").log2() / BigNumber.from(14699);
		var costExp4 = BigNumber.from("1e100").log2() / BigNumber.from(133976);
		var costExp5 = BigNumber.from("1e100").log2() / BigNumber.from(300295);
		var costExp6 = BigNumber.from("1e100").log2() / BigNumber.from(4144134);
		var costExp7 = BigNumber.from("1e100").log2() / BigNumber.from(5105093);
		var costExp8 = BigNumber.from("1e100").log2() / BigNumber.from(96996892);
		var costExp9 = BigNumber.from("1e100").log2() / BigNumber.from(96996891);
		var costExp10 = BigNumber.from("1e100").log2() / BigNumber.from(1804142330);
		let getDesc = (level) => "r_1=" + getr1(level).toString(0);
		r1 = theory.createUpgrade(0, currency, new CompositeCost(89,new ExponentialCost(1, costExp1),
											   new CompositeCost(1381,new ExponentialCost(BigNumber.from("1e100") * BigNumber.TWO.pow(costExp2), costExp2),
											   new CompositeCost(14701,new ExponentialCost(BigNumber.from("1e200") * BigNumber.TWO.pow(costExp3), costExp3),
											   new CompositeCost(133979,new ExponentialCost(BigNumber.from("1e300") * BigNumber.TWO.pow(costExp4), costExp4),
											   new CompositeCost(300300,new ExponentialCost(BigNumber.from("1e400") * BigNumber.TWO.pow(costExp5), costExp5),
											   new CompositeCost(4144140,new ExponentialCost(BigNumber.from("1e500") * BigNumber.TWO.pow(costExp6), costExp6),
											   new CompositeCost(5105100,new ExponentialCost(BigNumber.from("1e600") * BigNumber.TWO.pow(costExp7), costExp7),
											   new CompositeCost(96996900,new ExponentialCost(BigNumber.from("1e700") * BigNumber.TWO.pow(costExp8), costExp8),
											   new CompositeCost(96996900,new ExponentialCost(BigNumber.from("1e800") * BigNumber.TWO.pow(costExp9), costExp9),
											   new ExponentialCost(BigNumber.from("1e900") * BigNumber.TWO.pow(costExp10), costExp10)))))))))));
		r1.getDescription = (_) => Utils.getMath(getDesc(r1.level));
		r1.getInfo = (amount) => Utils.getMathTo(getDesc(r1.level), getDesc(r1.level + amount));
		r1.canBeRefunded = (level) => enableRefundsUpgrade.level > 0;
		r1.boughtOrRefunded = (_) => theory.clearGraph();
	}
	
	// r2
	{
		var costExp1 = BigNumber.from("1e100").log2() / BigNumber.from(44);
		var costExp2 = BigNumber.from("1e100").log2() / BigNumber.from(690);
		var costExp3 = BigNumber.from("1e100").log2() / BigNumber.from(7350);
		var costExp4 = BigNumber.from("1e100").log2() / BigNumber.from(66988);
		var costExp5 = BigNumber.from("1e100").log2() / BigNumber.from(150147);
		var costExp6 = BigNumber.from("1e100").log2() / BigNumber.from(2072067);
		var costExp7 = BigNumber.from("1e100").log2() / BigNumber.from(5105093);
		var costExp8 = BigNumber.from("1e100").log2() / BigNumber.from(48498445);
		var costExp9 = BigNumber.from("1e100").log2() / BigNumber.from(48498445);
		var costExp10 = BigNumber.from("1e100").log2() / BigNumber.from(902071165);
		let getDesc = (level) => "r_2=" + getr2(level).toString(0);
		r2 = theory.createUpgrade(1, currency, new CompositeCost(45,new ExponentialCost(1, costExp1),
											   new CompositeCost(691,new ExponentialCost(BigNumber.from("1e100") * BigNumber.TWO.pow(costExp2), costExp2),
											   new CompositeCost(7351,new ExponentialCost(BigNumber.from("1e200") * BigNumber.TWO.pow(costExp3), costExp3),
											   new CompositeCost(66989,new ExponentialCost(BigNumber.from("1e300") * BigNumber.TWO.pow(costExp4), costExp4),
											   new CompositeCost(150148,new ExponentialCost(BigNumber.from("1e400") * BigNumber.TWO.pow(costExp5), costExp5),
											   new CompositeCost(2552547,new ExponentialCost(BigNumber.from("1e500") * BigNumber.TWO.pow(costExp6), costExp6),
											   new CompositeCost(5105100,new ExponentialCost(BigNumber.from("1e600") * BigNumber.TWO.pow(costExp7), costExp7),
											   new CompositeCost(48498446,new ExponentialCost(BigNumber.from("1e700") * BigNumber.TWO.pow(costExp8), costExp8),
											   new CompositeCost(48498446,new ExponentialCost(BigNumber.from("1e800") * BigNumber.TWO.pow(costExp9), costExp9),
											   new ExponentialCost(BigNumber.from("1e900") * BigNumber.TWO.pow(costExp10), costExp10)))))))))));
		r2.getDescription = (_) => Utils.getMath(getDesc(r2.level));
		r2.getInfo = (amount) => Utils.getMathTo(getDesc(r2.level), getDesc(r2.level + amount));
		r2.canBeRefunded = (level) => enableRefundsUpgrade.level > 0;
		r2.boughtOrRefunded = (_) => theory.clearGraph();
		
	}
	
	// c1
	{
		let getDesc = (level) => "c_1=" + getc1(level).toString(2);
		c1 = theory.createUpgrade(2, currency, new ExponentialCost(1, 4));
		c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
		c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
		c1.maxLevel = 99;
		c1.canBeRefunded = (level) => enableRefundsUpgrade.level > 0;
		c1.boughtOrRefunded = (_) => theory.clearGraph();
	}
    
	
	// R
	{
		let getDesc = (level) => "R=" + getR(level).toString(0);
		R = theory.createUpgrade(3, currency, new FirstFreeCost(new CustomCost((level) => BigNumber.from(1.01) * r1.cost.getCost(Math.max(parseInt(getR(level + 1).toString(0,0,Rounding.NEAREST)) - 2, 0)))));
		R.getDescription = (_) => Utils.getMath(getDesc(R.level));
		R.getInfo = (amount) => Utils.getMathTo(getDesc(R.level), getDesc(R.level + amount));
		R.maxLevel = 100;
		R.canBeRefunded = (level) => enableRefundsUpgrade.level > 0;
		R.boughtOrRefunded = (_) => {
			theory.clearGraph();
		}
	}
	
	// q
	{
		let getDesc = (level) => 
		{
			if (level == 0) return "\\dot{q}=0";
			var pow = level - 1;
			return "\\dot{q}=2^{" + pow + "}"
		};
		let getInfo = (level) => "\\dot{q}=" + getqDot(level).toString(0);
		qDot = theory.createUpgrade(4, currency, new ExponentialCost(BigNumber.from("1e4"), 2));
		qDot.getDescription = (_) => Utils.getMath(getDesc(qDot.level));
		qDot.getInfo = (amount) => Utils.getMathTo(getInfo(qDot.level), getInfo(qDot.level + amount));
		qDot.canBeRefunded = (level) => enableRefundsUpgrade.level > 0;
	}
	
	// thetaDot
	{
		let getDesc = (level) => "\\dot{\\theta}=" + (level + 1);
		thetaDot = theory.createUpgrade(5, currency, new FreeCost());
		thetaDot.getDescription = (_) => Utils.getMath(getDesc(thetaDot.level));
		thetaDot.getInfo = (amount) => Utils.getMathTo(getDesc(thetaDot.level), getDesc(thetaDot.level + amount));
		thetaDot.canBeRefunded = (level) => enableRefundsUpgrade.level > 0;
		thetaDot.maxLevel = 3;
		thetaDot.isAvailable = false;
	}
	
	/////////////////////
    // Permanent Upgrades
	
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e15);
    theory.createAutoBuyerUpgrade(2, currency, 1e25);
	enableRefundsUpgrade = theory.createPermanentUpgrade(3, currency, new LinearCost(BigNumber.from("1e50"),0));
	// enableRefundsUpgrade.boughtOrRefunded = (_) =>
	// {
		// var alwaysShowRefundButtons = true;
	// }
	enableRefundsUpgrade.description = "Enable Refunds";
	enableRefundsUpgrade.maxLevel = 1;

	///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(2.5, 2.5));

    {
        r1Exp = theory.createMilestoneUpgrade(0, 3);
        r1Exp.description = Localization.getUpgradeIncCustomExpDesc("r_1", "0.5");
        r1Exp.info = Localization.getUpgradeIncCustomExpInfo("r_1", "0.5");
        r1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
	
	{
		r2VariesWithr1 = theory.createMilestoneUpgrade(3,1);
		r2VariesWithr1.description = "r2 varies with r1";
		r2VariesWithr1.info = "r2 varies with r1";
		r2VariesWithr1.boughtOrRefunded = (_) => {
			theory.invalidatePrimaryEquation();
			updateAvailability();
		}
	}
	
	{
        RExp = theory.createMilestoneUpgrade(2, 3);
        RExp.description = Localization.getUpgradeIncCustomExpDesc("R", "0.5");
        RExp.info = Localization.getUpgradeIncCustomExpInfo("R", "0.5");
        RExp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
	
	{
		r2VariesWithTheta = theory.createMilestoneUpgrade(4,1);
		r2VariesWithTheta.description = "r2 varies with \\theta";
		r2VariesWithTheta.info = "r2 varies with \\theta";
		r2VariesWithTheta.boughtOrRefunded = (_) => {
			theory.invalidatePrimaryEquation();
			updateAvailability();
		}
	}
	
	{
        r2Exp = theory.createMilestoneUpgrade(1, 3);
        r2Exp.description = Localization.getUpgradeIncCustomExpDesc("r_2", "0.5");
        r2Exp.info = Localization.getUpgradeIncCustomExpInfo("r_2", "0.5");
        r2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }	
	
	{
		thetaDotUnlock = theory.createMilestoneUpgrade(5,1);
		thetaDotUnlock.description = Localization.getUpgradeUnlockDesc("\\dot{\\theta}");
		thetaDotUnlock.info = Localization.getUpgradeUnlockInfo("\\dot{\\theta}");
		thetaDotUnlock.boughtOrRefunded = (_) => {
			thetaDot.level = 0;
			updateAvailability();
		}
	}
	
    updateAvailability();
}

var updateAvailability = () => {
	//regular upgrades
	r2.isAvailable = r2VariesWithr1.level == 0;
	c1.isAvailable = r2VariesWithr1.level == 1 && r2VariesWithTheta.level == 0;
	thetaDot.isAvailable = thetaDotUnlock.level > 0;
	
	//milestone upgrades
	r2VariesWithTheta.isAvailable = r2VariesWithr1.level == 1;
	
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
									
	t = t + dt * getThetaDot(thetaDot.level);
	
	var Rv = getR(R.level);
	var r1v = getr1(r1.level);
	var r2v = getr2(r2.level);
	var qDotv = getqDot(qDot.level);
	
	qv = qv + dt * qDotv;
	
	if (Rv != BigNumber.ZERO)
	{
		scalar = (BigNumber.from(0.7) / Rv);
		unscaledY = ((Rv - r1v) * (t).cos() + r2v * (t * (Rv - r1v)/r1v).cos());
		unscaledZ = ((Rv - r1v) * (t).sin() - r2v * (t * (Rv - r1v)/r1v).sin());
		state.y = (scalar * unscaledY).toNumber();
		state.z = (scalar * unscaledZ).toNumber();
		gcdRr1 = BigNumber.from(GCD(parseInt(Rv.toString(0,0,Rounding.NEAREST)), parseInt(r1v.toString(0,0,Rounding.NEAREST))));
		rhodot = bonus * qv * r1v.pow(getr1Exponent(r1Exp.level)) * r2v.pow(getr2Exponent(r2Exp.level)) * Rv.pow(getRExponent(RExp.level)) * (unscaledY * unscaledY + unscaledZ * unscaledZ).sqrt() / gcdRr1;
		currency.value += dt * rhodot;
	}
	
	theory.invalidateQuaternaryValues();
	theory.invalidateTertiaryEquation();
}

var postPublish = () => {
	t = BigNumber.ZERO;
    qv = BigNumber.ONE;
}

var getInternalState = () => `${t} ${qv}`;

var setInternalState = (state) => {
    let values = state.split(" ");
    if (values.length == 2)	{
		t = parseBigNumber(values[0]);
		qv = parseBigNumber(values[1]);
	}
}

///////////////////////////////
//	Supporting math functions

var getPublicationMultiplier = (tau) => tau.pow(1.5);
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value.pow(0.1);
var get3DGraphPoint = () => swizzles[0]((state - center) * scale);

var getR = (level) => {
	if (level == 0) { return BigNumber.ZERO; }
	if (level == 1) { return BigNumber.ONE; }
	
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
var getr2 = (level) => {
	if (r2VariesWithr1.level == 0){
		return BigNumber.from(level + 1);
	}
	
	var r1v = getr1(r1.level);
	if (r2VariesWithTheta.level == 1) {
		return .5 * r1v * ((BigNumber.PI * t / BigNumber.from(250)).sin() + BigNumber.ONE);
	}
	return r1v * getc1(c1.level);
}

var getc1 = (level) => {
	return BigNumber.from(0.01 * (level + 1));
}
	 
var getqDot = (level) => {
	if (level == 0) return BigNumber.ZERO;
	return BigNumber.TWO.pow(level - 1)
};

var getr1Exponent = (level) => BigNumber.from(1 + 0.5 * level);
var getr2Exponent = (level) => BigNumber.from(1 + 0.5 * level);
var getRExponent = (level) => BigNumber.from(1 + 0.5 * level);
var getThetaDot = (level) => BigNumber.from(level + 1);

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

////////////////////////////////
//	Formula and data display

var getPrimaryEquation = () => {
	theory.primaryEquationHeight = 100;
	theory.primaryEquationScale = .6;
	
	let result = "x=L\\cos(\\theta) + r_2\\cos(\\theta L r_1^{-1}) \\qquad L=R-r_1 \\\\";
	result += "y=L\\sin(\\theta) - r_2\\sin(\\theta L r_1^{-1}) \\qquad "
	
	if (r2VariesWithr1.level == 0) {
		result +="\\quad r_2=r_2";
	}
	else if (r2VariesWithTheta.level == 0){
		result +="\\quad r_2=c_1r_1";
	}
	else if (r2VariesWithTheta.level == 1) {
		result +="r_2=r_1(\\sin(\\frac{\\theta}{250})+1)";
	}
	
    result += " \\\\ \\\\ \\dot{\\rho}=\\frac{r_1";
	if (r1Exp.level > 0)
        result += "^{" + getr1Exponent(r1Exp.level).toString(1) + "}";
	
	result += "r_2"
	if (r2Exp.level > 0)
        result += "^{" + getr2Exponent(r2Exp.level).toString(1) + "}";
	
	result += "R";
	if (RExp.level > 0)
        result += "^{" + getRExponent(RExp.level).toString(1) + "}";
	
	result += "}{gcd(R, r_1)}\\cdot q \\sqrt{x^2+y^2}";
	
	
	//"\\quad \\begin{matrix} x=L\\cos(\\theta) + r_2\\cos(\\theta L r_1^{-1} )\\\\" +
	//"y=L\\sin(\\theta) - r_2\\sin(\\theta L r_1^{-1}) \\end{matrix}";// \\\\" + 
	//"\\\\r_2 = .5r_1 \\\\ \\\\ L = (R - r_1)";
    return result;
}

var getSecondaryEquation = () => {
	theory.secondaryEquationHeight =300;
	theory.secondaryEquationScale = 1;
	return "";
}

var getTertiaryEquation = () => {
	return "q=" + qv.toString(0) + "\\quad gcd(R, r1)=" + gcdRr1.toString(0);
}

var getQuaternaryEntries = () => {
    if (quaternaryEntries.length == 0)
    {
		quaternaryEntries.push(new QuaternaryEntry("L", null));
		quaternaryEntries.push(new QuaternaryEntry("r_2", null));
		quaternaryEntries.push(new QuaternaryEntry("\\theta", null));
		quaternaryEntries.push(new QuaternaryEntry("x", null));
		quaternaryEntries.push(new QuaternaryEntry("y", null));
		quaternaryEntries.push(new QuaternaryEntry("\\dot{\\rho}", null));
    }

	quaternaryEntries[0].value = (getR(R.level) - getr1(r1.level)).toString(0);
	quaternaryEntries[1].value = getr2(r2.level).toString(2);
    quaternaryEntries[2].value = t;
	quaternaryEntries[3].value = unscaledY;
	quaternaryEntries[4].value = -1 * unscaledZ;
	quaternaryEntries[5].value = rhodot;

    return quaternaryEntries;
}



init();