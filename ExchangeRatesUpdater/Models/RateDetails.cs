﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeRatesUpdater.Models
{
    internal class RateDetails
    {
        public string Currency { get; set; }
        public string Code { get; set; }
        public decimal Mid { get; set; }
    }
}
