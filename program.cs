using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Tambahkan CORS agar frontend HTML bisa berkomunikasi dengan API ini
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => 
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("AllowAll");

// Database sementara (In-Memory) untuk menyimpan status transaksi
var transactionsDb = new ConcurrentDictionary<string, string>();

// ====================================================================
// 1. ENDPOINT: Membuat QRIS (Dipanggil oleh Frontend Javascript)
// ====================================================================
app.MapPost("/create-qris", async ([FromBody] OrderRequest req) =>
{
    // TODO: Masukkan logika HttpClient di sini untuk menembak API asli Interactive QRIS.
    // Dokumentasi Interactive akan memberimu URL API dan format Headers (Merchant Key).
    
    // Simulasi respons (Ganti dengan respons asli dari API nantinya):
    string invoiceId = "INV-" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
    string qrImageUrl = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"; 
    
    // Simpan status awal ke database
    transactionsDb[invoiceId] = "PENDING";

    return Results.Ok(new { qrUrl = qrImageUrl, invoiceId = invoiceId });
});

// ====================================================================
// 2. ENDPOINT: Pengecekan Status / Polling (Dipanggil oleh Frontend)
// ====================================================================
app.MapGet("/check-status/{invoiceId}", (string invoiceId) =>
{
    if (transactionsDb.TryGetValue(invoiceId, out string? status))
    {
        bool isPaid = status == "PAID";
        return Results.Ok(new { isPaid = isPaid });
    }
    return Results.NotFound(new { message = "Invoice tidak ditemukan" });
});

// ====================================================================
// 3. ENDPOINT: Callback / Webhook (Dipanggil oleh Server Interactive QRIS)
// ====================================================================
app.MapPost("/qris-callback", async ([FromBody] InteractiveCallback data) =>
{
    // Interactive QRIS akan menembak URL endpoint ini secara otomatis saat pembeli sukses transfer.
    // TODO: Tambahkan validasi 'Signature'/Hash dari Interactive untuk memastikan ini bukan request palsu.
    
    if (data.Status.ToUpper() == "PAID")
    {
        // Update status di database menjadi PAID
        transactionsDb[data.InvoiceId] = "PAID";
        
        // TODO: Eksekusi pengiriman produk digital (misal auto-send script ke email pembeli)
    }
    
    return Results.Ok(new { message = "Callback processed" });
});

app.Run();

// ====================================================================
// --- MODEL CLASS ---
// ====================================================================
public class OrderRequest 
{ 
    public int ProductId { get; set; } 
    public int Amount { get; set; } 
}

public class InteractiveCallback 
{ 
    public string InvoiceId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Signature { get; set; } = string.Empty;
}