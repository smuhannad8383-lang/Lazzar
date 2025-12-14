import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types & Constants ---

type Status = 'قيد التشخيص' | 'في انتظار القطعة' | 'قيد الإصلاح' | 'جاهز للتسليم' | 'تم التسليم' | 'مرتجع';
type Language = 'ar' | 'en';

const STATUSES: Status[] = [
  'قيد التشخيص',
  'في انتظار القطعة',
  'قيد الإصلاح',
  'جاهز للتسليم',
  'تم التسليم',
  'مرتجع'
];

// Translation Dictionary
const TRANSLATIONS = {
  ar: {
    app_title: "نظام إدارة مركز الصيانة",
    tab_dashboard: "لوحة المعلومات",
    tab_new_request: "طلب جديد",
    tab_followup: "المتابعة",
    tab_suppliers: "الموردين",
    tab_finance: "المالية",
    tab_withdrawals: "السحوبات",
    tab_history: "السجل",
    dash_notifications: "التنبيهات",
    dash_clear_all: "مسح الكل",
    dash_no_notifications: "لا توجد تنبيهات جديدة",
    dash_active_devices: "الأجهزة النشطة",
    dash_ready_devices: "جاهزة للتسليم",
    dash_delayed: "تأخر في التشخيص",
    dash_waiting_parts: "انتظار قطع غيار",
    dash_call_reminder: "تذكير بالاتصال",
    dash_empty_delayed: "ممتاز! لا توجد أجهزة متأخرة",
    dash_empty_parts: "لا توجد أجهزة معلقة",
    dash_empty_ready: "تم تسليم جميع الأجهزة",
    dash_sys_mgmt: "إدارة النظام",
    dash_backup_desc: "حفظ نسخة احتياطية من البيانات أو استعادتها.",
    dash_export: "نسخ احتياطي",
    dash_import: "استعادة",
    dash_reset: "ضبط المصنع",
    dash_lang_settings: "إعدادات اللغة",
    dash_switch_lang: "English",
    days: "يوم",
    currency: "", 
    search: "بحث شامل...",
    search_ph: "ابحث عن اسم، هاتف، جهاز...",
    filter_status: "تصفية الحالة:",
    sort_by: "الترتيب:",
    view_all: "عرض الكل",
    sort_date_desc: "الأحدث",
    sort_date_asc: "الأقدم",
    sort_name: "الاسم",
    sort_status: "الحالة",
    no_data: "لا توجد بيانات للعرض",
    th_date: "التاريخ",
    th_customer: "العميل",
    th_device: "الجهاز",
    th_issue: "العطل",
    th_supplier: "المورد",
    th_status: "الحالة",
    th_action: "الإجراء",
    th_notes: "ملاحظات",
    th_phone: "الهاتف",
    th_cost: "التكلفة",
    th_price: "السعر",
    th_profit: "الربح",
    th_desc: "البيان",
    th_debit: "مشتريات (مدين)",
    th_credit: "مدفوعات (دائن)",
    th_balance: "الرصيد",
    btn_save: "حفظ البيانات",
    btn_add: "إضافة",
    btn_cancel: "إلغاء",
    btn_return: "استرجاع",
    btn_advance: "نقل مرحلة",
    btn_delete: "حذف",
    btn_clone: "تكرار",
    btn_close: "إغلاق",
    btn_confirm: "تأكيد",
    btn_undo: "تراجع",
    sup_add_new: "مورد جديد",
    sup_add_payment: "تسجيل دفعة",
    sup_name: "الاسم",
    sup_contact: "رقم الهاتف",
    sup_report: "كشف حساب",
    sup_total_buy: "إجمالي المشتريات",
    sup_total_pay: "إجمالي المدفوعات",
    sup_current_bal: "الرصيد الحالي",
    pay_completed: "مدفوع",
    pay_pending: "معلق",
    fin_title: "المركز المالي",
    fin_revenue: "الإيرادات",
    fin_cost_sold: "التكاليف",
    fin_losses: "الخسائر",
    fin_shared_exp: "مصروفات",
    fin_net_dist: "صافي الربح:",
    fin_net_desc: "الإيراد - (التكلفة + الخسائر + المصروفات)",
    fin_details: "تفاصيل الأرباح",
    fin_add_exp: "إضافة مصروف",
    fin_amount: "المبلغ",
    fin_desc: "الوصف",
    fin_record: "تسجيل",
    wd_title: "سحوبات الشركاء",
    wd_tech: "الفني",
    wd_manager: "المدير",
    wd_share: "الحصة",
    wd_drawn: "مسحوب",
    wd_avail: "متاح",
    wd_new: "سحب جديد",
    wd_partner: "الشريك",
    wd_tech_opt: "فني",
    wd_manager_opt: "مدير",
    status_diagnosing: 'قيد التشخيص',
    status_waiting_parts: 'في انتظار القطعة',
    status_repairing: 'قيد الإصلاح',
    status_ready: 'جاهز للتسليم',
    status_delivered: 'تم التسليم',
    status_returned: 'مرتجع',
    note_backup_success: "تم حفظ النسخة الاحتياطية",
    note_import_success: "تم استعادة البيانات",
    note_import_error: "خطأ في الملف",
    note_loss_warning: "تم تسجيل خسارة على المركز",
    note_return_success: "تم استرجاع القطعة للمورد",
    req_title: "طلب صيانة",
    req_expected_cost: "التكلفة",
    req_price_client: "السعر",
    req_supplier_opt: "اختياري",
    req_save: "إنشاء الطلب",
    modal_det: "تفاصيل",
    modal_fin_data: "المالية",
    modal_loss_text: "خسارة مسجلة: {cost}",
    modal_no_loss: "بدون خسارة (إرجاع للمخزن)",
    confirm_return_title: "استرجاع",
    confirm_cancel_title: "إلغاء",
    confirm_q: "حالة القطعة؟",
    confirm_opt_ok: "سليمة / للمورد",
    confirm_opt_ok_desc: "إلغاء التكلفة والدين",
    confirm_opt_bad: "تالفة / مستخدمة",
    confirm_opt_bad_desc: "تسجيل خسارة",
    confirm_delete: "هل أنت متأكد من حذف هذا الطلب نهائياً؟",
    login_title: "تسجيل الدخول",
    login_user: "اسم المستخدم",
    login_pass: "كلمة المرور",
    login_btn: "دخول",
    logout_btn: "خروج",
    login_error: "بيانات الدخول غير صحيحة"
  },
  en: {
    app_title: "Repair Center Manager",
    tab_dashboard: "Dashboard",
    tab_new_request: "New Request",
    tab_followup: "Active Jobs",
    tab_suppliers: "Suppliers",
    tab_finance: "Finance",
    tab_withdrawals: "Withdrawals",
    tab_history: "History",
    dash_notifications: "Notifications",
    dash_clear_all: "Clear",
    dash_no_notifications: "All caught up",
    dash_active_devices: "Active Jobs",
    dash_ready_devices: "Ready",
    dash_delayed: "Delayed",
    dash_waiting_parts: "Parts Pending",
    dash_call_reminder: "Call Reminder",
    dash_empty_delayed: "No delays",
    dash_empty_parts: "No pending parts",
    dash_empty_ready: "Nothing to pickup",
    dash_sys_mgmt: "System",
    dash_backup_desc: "Backup or restore your database.",
    dash_export: "Backup",
    dash_import: "Restore",
    dash_reset: "Reset",
    dash_lang_settings: "Language",
    dash_switch_lang: "العربية",
    days: "days",
    currency: "", 
    search: "Search...",
    search_ph: "Name, Device, Issue...",
    filter_status: "Status:",
    sort_by: "Sort:",
    view_all: "All",
    sort_date_desc: "Newest",
    sort_date_asc: "Oldest",
    sort_name: "Name",
    sort_status: "Status",
    no_data: "No data found",
    th_date: "Date",
    th_customer: "Customer",
    th_device: "Device",
    th_issue: "Issue",
    th_supplier: "Supplier",
    th_status: "Status",
    th_action: "Action",
    th_notes: "Notes",
    th_phone: "Phone",
    th_cost: "Cost",
    th_price: "Price",
    th_profit: "Profit",
    th_desc: "Desc",
    th_debit: "Purchases (Debit)",
    th_credit: "Payments (Credit)",
    th_balance: "Balance",
    btn_save: "Save",
    btn_add: "Add",
    btn_cancel: "Cancel",
    btn_return: "Return",
    btn_advance: "Next Stage",
    btn_delete: "Delete",
    btn_clone: "Clone",
    btn_close: "Close",
    btn_confirm: "Confirm",
    btn_undo: "Undo",
    sup_add_new: "New Supplier",
    sup_add_payment: "Add Payment",
    sup_name: "Name",
    sup_contact: "Contact",
    sup_report: "Statement",
    sup_total_buy: "Total Purchases",
    sup_total_pay: "Total Payments",
    sup_current_bal: "Current Balance",
    pay_completed: "Paid",
    pay_pending: "Pending",
    fin_title: "Financial Overview",
    fin_revenue: "Revenue",
    fin_cost_sold: "COGS",
    fin_losses: "Losses",
    fin_shared_exp: "Expenses",
    fin_net_dist: "Net Profit:",
    fin_net_desc: "Rev - (Cost + Loss + Exp)",
    fin_details: "Profit Breakdown",
    fin_add_exp: "Add Expense",
    fin_amount: "Amount",
    fin_desc: "Desc",
    fin_record: "Record",
    wd_title: "Partner Withdrawals",
    wd_tech: "Technician",
    wd_manager: "Manager",
    wd_share: "Share",
    wd_drawn: "Drawn",
    wd_avail: "Available",
    wd_new: "New Withdrawal",
    wd_partner: "Partner",
    wd_tech_opt: "Technician",
    wd_manager_opt: "Manager",
    status_diagnosing: 'Diagnosing',
    status_waiting_parts: 'Waiting Part',
    status_repairing: 'Repairing',
    status_ready: 'Ready',
    status_delivered: 'Delivered',
    status_returned: 'Returned',
    note_backup_success: "Backup Saved",
    note_import_success: "Restored Successfully",
    note_import_error: "File Error",
    note_loss_warning: "Loss Recorded",
    note_return_success: "Returned to Supplier",
    req_title: "New Request",
    req_expected_cost: "Est. Cost",
    req_price_client: "Price",
    req_supplier_opt: "Optional",
    req_save: "Create",
    modal_det: "Details",
    modal_fin_data: "Financials",
    modal_loss_text: "Loss: {cost}",
    modal_no_loss: "No Loss (Returned)",
    confirm_return_title: "Return Device",
    confirm_cancel_title: "Cancel Order",
    confirm_q: "Part Status?",
    confirm_opt_ok: "Good / Returned",
    confirm_opt_ok_desc: "Cancel Cost/Debt",
    confirm_opt_bad: "Damaged / Used",
    confirm_opt_bad_desc: "Record Loss",
    confirm_delete: "Are you sure you want to delete this order?",
    login_title: "Login",
    login_user: "Username",
    login_pass: "Password",
    login_btn: "Login",
    logout_btn: "Logout",
    login_error: "Invalid Credentials"
  }
};

// --- Interfaces ---

interface Supplier { id: number; name: string; contact: string; notes: string; }
interface SupplierPayment { id: number; date: string; supplierId: number; amount: number; notes: string; status: 'completed' | 'pending'; }
interface Order { id: number; date: string; customerName: string; phone: string; device: string; issue: string; status: Status; cost: number; price: number; notes: string; supplierId?: number; originalCost?: number; }
interface Transaction { id: number; date: string; type: 'سحب_فني' | 'سحب_مدير' | 'مصروف_مشترك'; amount: number; description: string; isCancelled?: boolean; }
interface AppNotification { id: number; message: string; timestamp: string; isRead: boolean; type: 'info' | 'success' | 'warning'; }

// --- Helpers ---
const formatDate = (isoString: string) => { if (!isoString) return ''; try { return new Date(isoString).toLocaleDateString('en-GB'); } catch (e) { return isoString; } };
const formatTime = (isoString: string) => { if (!isoString) return ''; try { return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
const getDaysDifference = (dateString: string) => { const date = new Date(dateString); const now = new Date(); return Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)); };

// --- Styles System ---

const GlobalStyles = () => (
  <style>{`
    :root {
      --primary: #3b82f6;
      --primary-dark: #2563eb;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --dark: #1e293b;
      --light: #f8fafc;
      --white: #ffffff;
      --gray-100: #f1f5f9;
      --gray-200: #e2e8f0;
      --gray-300: #cbd5e1;
      --gray-500: #64748b;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --radius: 12px;
    }
    
    body { 
      background-color: #f1f5f9; 
      color: var(--dark);
    }
    
    /* Modern Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    /* Transitions */
    button, input, select { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
    
    /* Table Styles */
    .modern-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .modern-table th { 
      background: var(--gray-100); 
      color: var(--gray-500); 
      font-weight: 600; 
      padding: 12px 16px; 
      font-size: 0.85rem; 
      text-transform: uppercase; 
      letter-spacing: 0.05em;
      border-bottom: 2px solid var(--gray-200);
    }
    .modern-table td { 
      padding: 16px; 
      background: white; 
      border-bottom: 1px solid var(--gray-100); 
      font-size: 0.95rem;
    }
    .modern-table tr:last-child td { border-bottom: none; }
    .modern-table tr:hover td { background-color: #f8fafc; }
    
    /* Inputs */
    .form-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--gray-300);
      background-color: var(--white);
      color: var(--dark);
      font-size: 0.95rem;
      outline: none;
    }
    .form-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
    
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: fadeIn 0.4s ease-out forwards; }
  `}</style>
);

const getStyles = (dir: 'rtl' | 'ltr') => ({
  container: { fontFamily: dir === 'rtl' ? "'Cairo', sans-serif" : "'Inter', sans-serif", direction: dir, padding: '30px', maxWidth: '1200px', margin: '0 auto' },
  header: { 
    marginBottom: '30px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    background: 'white',
    padding: '20px 30px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow)',
    border: '1px solid rgba(255,255,255,0.5)'
  },
  logoTitle: { fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  tabs: { 
    display: 'flex', 
    marginBottom: '30px', 
    gap: '10px', 
    overflowX: 'auto' as const, 
    padding: '5px',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)'
  },
  tabButton: (isActive: boolean) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--gray-500)',
    fontWeight: isActive ? '700' : '500',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap' as const,
    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
    position: 'relative' as const
  }),
  notificationBadge: {
    position: 'absolute' as const,
    top: '-5px',
    [dir === 'rtl' ? 'left' : 'right']: '-5px',
    backgroundColor: 'var(--danger)',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    border: '2px solid white'
  },
  card: { 
    backgroundColor: 'white', 
    padding: '25px', 
    borderRadius: '16px', 
    boxShadow: 'var(--shadow)', 
    marginBottom: '25px',
    border: '1px solid var(--gray-100)'
  },
  grid: { display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' },
  statCard: (color: string) => ({
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    border: `1px solid ${color}20`,
    borderRight: dir === 'rtl' ? `4px solid ${color}` : `1px solid ${color}20`,
    borderLeft: dir === 'ltr' ? `4px solid ${color}` : `1px solid ${color}20`,
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '120px'
  }),
  button: { 
    backgroundColor: 'var(--primary)', 
    color: 'white', 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
  },
  secondaryButton: { 
    backgroundColor: 'white', 
    color: 'var(--gray-500)', 
    border: '1px solid var(--gray-300)', 
    padding: '8px 16px', 
    borderRadius: '10px', 
    cursor: 'pointer', 
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px' 
  },
  dangerButton: { 
    backgroundColor: '#fee2e2', 
    color: '#ef4444', 
    padding: '6px 12px', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  modalOverlay: { 
    position: 'fixed' as const, 
    top: 0, left: 0, right: 0, bottom: 0, 
    backgroundColor: 'rgba(15, 23, 42, 0.6)', 
    backdropFilter: 'blur(4px)',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000 
  },
  modalContent: { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '24px', 
    width: '90%', 
    maxWidth: '600px', 
    maxHeight: '85vh', 
    overflowY: 'auto' as const, 
    position: 'relative' as const,
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--gray-100)'
  },
  toast: (type: 'success' | 'error' | 'info' | 'warning') => ({
    position: 'fixed' as const,
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: type === 'error' ? '#fee2e2' : (type === 'success' ? '#dcfce7' : (type === 'warning' ? '#fef3c7' : '#e0f2fe')),
    color: type === 'error' ? '#991b1b' : (type === 'success' ? '#166534' : (type === 'warning' ? '#92400e' : '#075985')),
    padding: '12px 24px',
    borderRadius: '50px',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 10000,
    fontSize: '0.95rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: `1px solid ${type === 'error' ? '#fca5a5' : (type === 'success' ? '#86efac' : (type === 'warning' ? '#fcd34d' : '#7dd3fc'))}`
  }),
});

const getStatusBadgeStyle = (status: Status) => {
    let bg = '#f1f5f9'; let col = '#64748b';
    switch (status) {
      case 'قيد التشخيص': bg = '#fef9c3'; col = '#854d0e'; break; // Yellow
      case 'في انتظار القطعة': bg = '#ffedd5'; col = '#9a3412'; break; // Orange
      case 'قيد الإصلاح': bg = '#dbeafe'; col = '#1e40af'; break; // Blue
      case 'جاهز للتسليم': bg = '#f3e8ff'; col = '#6b21a8'; break; // Purple
      case 'تم التسليم': bg = '#dcfce7'; col = '#166534'; break; // Green
      case 'مرتجع': bg = '#fee2e2'; col = '#991b1b'; break; // Red
    }
    return { 
      backgroundColor: bg, 
      color: col, 
      padding: '6px 14px', 
      borderRadius: '20px', 
      fontSize: '0.8rem', 
      fontWeight: '700', 
      display: 'inline-block',
      textAlign: 'center' as const,
      border: `1px solid ${bg}`
    };
};

// --- Dashboard Component ---

const DashboardTab = ({ orders, activeOrders, readyForPickup, delayedDiagnosis, waitingParts, notifications, onClearNotifications, onExport, onImport, onShowToast, t, styles }: any) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { try { onImport(JSON.parse(ev.target?.result as string)); } catch { onShowToast(t('note_import_error'), 'error'); } };
      reader.readAsText(file);
      e.target.value = '';
    }
  };

  const translateStatus = (status: Status) => {
    const map: Record<Status, string> = { 'قيد التشخيص': 'status_diagnosing', 'في انتظار القطعة': 'status_waiting_parts', 'قيد الإصلاح': 'status_repairing', 'جاهز للتسليم': 'status_ready', 'تم التسليم': 'status_delivered', 'مرتجع': 'status_returned' };
    return t(map[status]);
  };

  const NotificationCard = ({ title, items, color, emptyMsg }: { title: string, items: Order[], color: string, emptyMsg: string }) => (
    <div style={styles.statCard(color)}>
      <h4 style={{color, margin: '0 0 10px 0', fontSize: '1rem'}}>{title}</h4>
      <h2 style={{fontSize: '2.5rem', margin: 0, fontWeight: 800, color: '#334155'}}>{items.length}</h2>
      {items.length > 0 ? (
        <div style={{marginTop: '10px', fontSize: '0.85rem', color: '#64748b'}}>
          {items.slice(0, 3).map(o => <div key={o.id} style={{marginBottom: '4px'}}>• {o.device}</div>)}
          {items.length > 3 && <span>+ {items.length - 3} more</span>}
        </div>
      ) : <span style={{fontSize: '0.85rem', color: '#94a3b8', marginTop: '10px'}}>{emptyMsg}</span>}
    </div>
  );

  return (
    <div className="animate-in">
      <div style={{...styles.grid, marginBottom: '25px'}}>
         <div style={{...styles.statCard('#3b82f6'), background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none'}}>
           <span style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>{t('dash_active_devices')}</span>
           <span style={{color: 'white', fontSize: '3rem', fontWeight: '800'}}>{activeOrders.length}</span>
         </div>
         <div style={{...styles.statCard('#10b981'), background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none'}}>
           <span style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>{t('dash_ready_devices')}</span>
           <span style={{color: 'white', fontSize: '3rem', fontWeight: '800'}}>{readyForPickup.length}</span>
         </div>
         {/* Action Notifications */}
         <NotificationCard title={t('dash_delayed')} items={delayedDiagnosis} color="#ef4444" emptyMsg={t('dash_empty_delayed')}/>
         <NotificationCard title={t('dash_waiting_parts')} items={waitingParts} color="#f59e0b" emptyMsg={t('dash_empty_parts')}/>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px'}}>
        {/* Notifications List */}
        <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h3 style={{margin: 0, color: '#1e293b'}}>{t('dash_notifications')}</h3>
                {notifications.length > 0 && <button onClick={onClearNotifications} style={{...styles.secondaryButton, fontSize: '0.8rem', padding: '4px 10px'}}>{t('dash_clear_all')}</button>}
            </div>
            <div style={{maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {notifications.length === 0 ? <p style={{color: '#94a3b8', textAlign: 'center', padding: '20px'}}>{t('dash_no_notifications')}</p> : 
                 notifications.map((n: AppNotification) => (
                    <div key={n.id} style={{padding: '12px', borderRadius: '8px', backgroundColor: n.type === 'warning' ? '#fffbeb' : '#f8fafc', borderLeft: `4px solid ${n.type === 'warning' ? '#f59e0b' : '#3b82f6'}`}}>
                        <div style={{fontSize: '0.9rem', color: '#334155', fontWeight: '500'}}>{n.message}</div>
                        <div style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px'}}>{formatTime(n.timestamp)}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* System Management */}
        <div style={styles.card}>
            <h3 style={{margin: '0 0 15px 0', color: '#1e293b'}}>{t('dash_sys_mgmt')}</h3>
            <p style={{color: '#64748b', marginBottom: '20px', lineHeight: '1.5'}}>{t('dash_backup_desc')}</p>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                <button style={{...styles.button, flex: 1, justifyContent: 'center'}} onClick={onExport}>📂 {t('dash_export')}</button>
                <label style={{...styles.secondaryButton, flex: 1, justifyContent: 'center'}}>
                    📥 {t('dash_import')}
                    <input type="file" accept=".json" style={{display: 'none'}} onChange={handleFileChange} />
                </label>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- FollowUp Component ---

const FollowUpList = ({ orders, onUpdateStatus, onClone, onDelete, onUpdateOrder, suppliers, onShowToast, t, styles }: any) => {
  const [filterStatus, setFilterStatus] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionOrder, setActionOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'return' | 'delete'>('cancel');

  const confirmAction = (isLost: boolean) => {
    if (!actionOrder) return;
    if (actionType === 'delete') {
      onDelete(actionOrder.id);
      onShowToast('Deleted', 'success');
    } else {
      onUpdateStatus(actionOrder.id, 'مرتجع', isLost ? actionOrder.cost : 0);
      onShowToast(isLost ? t('note_loss_warning') : t('note_return_success'), isLost ? 'warning' : 'success');
    }
    setActionOrder(null);
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o: Order) => o.customerName.toLowerCase().includes(q) || o.device.toLowerCase().includes(q) || String(o.id).includes(q));
    }
    if (filterStatus !== 'الكل') result = result.filter((o: Order) => o.status === filterStatus);
    return result;
  }, [orders, filterStatus, searchQuery]);

  // Changed: Allow editing for all statuses to enable fixing mistakes in delivered/returned orders
  const isEditable = (status: Status) => true;

  return (
    <div className="animate-in">
      <div style={{...styles.card, display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center'}}>
        <div style={{flex: 2, minWidth: '200px'}}>
            <label style={{display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#64748b'}}>{t('search')}</label>
            <input className="form-input" placeholder={t('search_ph')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div style={{flex: 1, minWidth: '150px'}}>
          <label style={{display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: '#64748b'}}>{t('filter_status')}</label>
          <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="الكل">{t('view_all')}</option>
            {STATUSES.map(s => <option key={s} value={s}>{t('status_' + (s === 'قيد التشخيص' ? 'diagnosing' : s === 'في انتظار القطعة' ? 'waiting_parts' : s === 'قيد الإصلاح' ? 'repairing' : s === 'جاهز للتسليم' ? 'ready' : s === 'تم التسليم' ? 'delivered' : 'returned'))}</option>)}
          </select>
        </div>
      </div>

      <div style={{...styles.card, padding: 0, overflow: 'hidden'}}>
        <div style={{overflowX: 'auto'}}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('th_date')}</th>
                <th>{t('th_customer')}</th>
                <th>{t('th_device')}</th>
                <th>{t('th_status')}</th>
                <th style={{textAlign: 'center'}}>{t('th_action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? <tr><td colSpan={6} style={{textAlign: 'center', color: '#94a3b8', padding: '30px'}}>{t('no_data')}</td></tr> : 
              filteredOrders.map((order: Order) => (
                <tr key={order.id} onClick={() => setSelectedOrder(order)} style={{cursor: 'pointer'}}>
                  <td style={{fontFamily: 'monospace', color: '#64748b'}}>#{String(order.id).slice(-4)}</td>
                  <td>{formatDate(order.date)}</td>
                  <td style={{fontWeight: '600'}}>{order.customerName}</td>
                  <td>{order.device}</td>
                  <td><span style={getStatusBadgeStyle(order.status)}>{order.status}</span></td>
                  <td style={{textAlign: 'center'}} onClick={e => e.stopPropagation()}>
                    {order.status !== 'مرتجع' && order.status !== 'تم التسليم' && (
                        <button style={{...styles.button, fontSize: '0.8rem', padding: '6px 12px', marginRight: '5px'}} onClick={() => onUpdateStatus(order.id, STATUSES[STATUSES.indexOf(order.status) + 1])}>{t('btn_advance')}</button>
                    )}
                    {/* Clone Button */}
                    <button style={{...styles.secondaryButton, fontSize: '0.8rem', padding: '6px 12px', marginRight: '5px'}} onClick={() => onClone(order)}>{t('btn_clone')}</button>
                    
                    {order.status === 'تم التسليم' ? (
                        <button style={styles.dangerButton} onClick={() => { setActionOrder(order); setActionType('return'); }}>{t('btn_return')}</button>
                    ) : order.status !== 'مرتجع' ? (
                        <button style={styles.dangerButton} onClick={() => { setActionOrder(order); setActionType('cancel'); }}>{t('btn_cancel')}</button>
                    ) : <span style={{fontSize: '0.8rem', color: '#ef4444'}}>Cancelled</span>}

                    {/* Delete Button (Always visible now) */}
                    <button style={{...styles.dangerButton, marginLeft:'5px', backgroundColor: '#fecaca', color: '#b91c1c'}} onClick={() => { setActionOrder(order); setActionType('delete'); }}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px'}}>
               <h2 style={{margin: 0, fontSize: '1.25rem'}}>#{String(selectedOrder.id).slice(-4)} - {selectedOrder.device}</h2>
               <button onClick={() => setSelectedOrder(null)} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8'}}>✕</button>
            </div>
            <div style={styles.grid}>
               <div><label style={{fontSize: '0.8rem', color: '#64748b'}}>{t('th_customer')}</label><div style={{fontWeight: '600'}}>{selectedOrder.customerName}</div></div>
               <div><label style={{fontSize: '0.8rem', color: '#64748b'}}>{t('th_phone')}</label><div style={{fontWeight: '600'}}>{selectedOrder.phone}</div></div>
               <div><label style={{fontSize: '0.8rem', color: '#64748b'}}>{t('th_issue')}</label><div style={{fontWeight: '600'}}>{selectedOrder.issue}</div></div>
               
               <div>
                 <label style={{fontSize: '0.8rem', color: '#64748b'}}>{t('th_cost')}</label>
                 {isEditable(selectedOrder.status) ? (
                    <input 
                      className="form-input" 
                      type="number" 
                      value={selectedOrder.cost} 
                      onChange={e => setSelectedOrder({...selectedOrder, cost: Number(e.target.value)})}
                      onBlur={() => onUpdateOrder(selectedOrder)}
                      style={{padding:'4px 8px', borderColor: '#ef4444', color: '#ef4444', fontWeight: 'bold'}}
                    />
                 ) : (
                    <div style={{fontWeight: '600', color: '#ef4444'}}>{selectedOrder.cost}</div>
                 )}
               </div>
               <div>
                 <label style={{fontSize: '0.8rem', color: '#64748b'}}>{t('req_price_client')}</label>
                 {isEditable(selectedOrder.status) ? (
                    <input 
                      className="form-input" 
                      type="number" 
                      value={selectedOrder.price} 
                      onChange={e => setSelectedOrder({...selectedOrder, price: Number(e.target.value)})}
                      onBlur={() => onUpdateOrder(selectedOrder)}
                      style={{padding:'4px 8px', borderColor: '#10b981', color: '#10b981', fontWeight: 'bold'}}
                    />
                 ) : (
                    <div style={{fontWeight: '600', color: '#10b981'}}>{selectedOrder.price}</div>
                 )}
               </div>

            </div>
            <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px'}}>
               <label style={{fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '5px'}}>{t('th_notes')}</label>
               <div style={{whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#334155'}}>{selectedOrder.notes || t('no_data')}</div>
            </div>
          </div>
        </div>
      )}
      
      {actionOrder && (
        <div style={styles.modalOverlay} onClick={() => setActionOrder(null)}>
          <div style={{...styles.modalContent, textAlign: 'center'}}>
             <h3 style={{color: '#ef4444'}}>{actionType === 'delete' ? t('btn_delete') : (actionType === 'return' ? t('confirm_return_title') : t('confirm_cancel_title'))}</h3>
             <p>{actionType === 'delete' ? t('confirm_delete') : t('confirm_q')}</p>
             <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px'}}>
                {actionType === 'delete' ? (
                  <button style={{...styles.button, backgroundColor: '#ef4444', justifyContent: 'center'}} onClick={() => confirmAction(false)}>{t('btn_delete')}</button>
                ) : (
                  <>
                    <button style={{...styles.button, backgroundColor: '#10b981', justifyContent: 'center'}} onClick={() => confirmAction(false)}>{t('confirm_opt_ok')}</button>
                    <button style={{...styles.button, backgroundColor: '#ef4444', justifyContent: 'center'}} onClick={() => confirmAction(true)}>{t('confirm_opt_bad')}</button>
                  </>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Suppliers & Finance ---

const SuppliersTab = ({ suppliers, orders, payments, onAdd, onDelete, onAddPayment, onUpdatePayment, t, styles }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '' });
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  
  // New States for Payment & Editing
  const [payForm, setPayForm] = useState({ amount: '', notes: '' });
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const getBal = (id: number) => {
      const debt = orders.filter((o:Order) => o.supplierId === id && o.cost > 0).reduce((s:number, o:Order) => s + o.cost, 0);
      const paid = payments.filter((p:SupplierPayment) => p.supplierId === id && p.status === 'completed').reduce((s:number, p:SupplierPayment) => s + p.amount, 0);
      return { debt, paid, bal: debt - paid };
  };

  const handleAddPayment = () => {
      if (!selectedSupplierId || !payForm.amount) return;
      onAddPayment({
          id: 0, 
          date: new Date().toISOString(),
          supplierId: selectedSupplierId,
          amount: Number(payForm.amount),
          notes: payForm.notes,
          status: 'completed'
      });
      setPayForm({ amount: '', notes: '' });
  };

  const handleSaveEdit = (p: SupplierPayment) => {
      if (onUpdatePayment) {
          onUpdatePayment({ ...p, notes: editNotes });
          setEditingPaymentId(null);
      }
  };

  const selectedSupplier = suppliers.find((s: Supplier) => s.id === selectedSupplierId);

  // History with Running Balance Calculation
  const historyData = useMemo(() => {
      if (!selectedSupplierId) return { list: [], totalDebit: 0, totalCredit: 0, balance: 0 };
      
      const ords = orders.filter((o:Order) => o.supplierId === selectedSupplierId && o.cost > 0).map((o:Order) => ({...o, type: 'order'}));
      const pays = payments.filter((p:SupplierPayment) => p.supplierId === selectedSupplierId).map((p:SupplierPayment) => ({...p, type: 'payment'}));
      
      // Sort Oldest to Newest to calculate running balance
      const sorted = [...ords, ...pays].sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let runningBalance = 0;
      let totalDebit = 0;
      let totalCredit = 0;

      const processed = sorted.map(item => {
          let debit = 0;
          let credit = 0;
          if (item.type === 'order') {
              debit = item.cost;
              totalDebit += debit;
              runningBalance += debit;
          } else {
              credit = item.amount;
              totalCredit += credit;
              runningBalance -= credit;
          }
          return { ...item, debit, credit, balance: runningBalance };
      });

      // Reverse to show Newest First for display
      return { 
          list: processed.reverse(),
          totalDebit,
          totalCredit,
          balance: runningBalance
      };
  }, [selectedSupplierId, orders, payments]);

  return (
    <div className="animate-in">
        <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'flex-end'}}>
            <button style={styles.button} onClick={() => setShowAdd(!showAdd)}>{showAdd ? t('btn_cancel') : t('sup_add_new')}</button>
        </div>
        {showAdd && (
            <div style={styles.card}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                    <input className="form-input" placeholder={t('sup_name')} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input className="form-input" placeholder={t('sup_contact')} value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
                </div>
                <button style={styles.button} onClick={() => { onAdd({...form, id: 0, notes: ''}); setShowAdd(false); setForm({name:'', contact:''}); }}>{t('btn_add')}</button>
            </div>
        )}
        <div style={styles.grid}>
            {suppliers.map((s: Supplier) => {
                const stats = getBal(s.id);
                return (
                    <div key={s.id} style={styles.card}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <h3 style={{margin: 0}}>{s.name}</h3>
                            <div style={{display:'flex', gap:'5px'}}>
                                <button onClick={() => setSelectedSupplierId(s.id)} style={{...styles.secondaryButton, fontSize:'0.8rem', padding:'4px 10px'}}>📄 {t('sup_report')}</button>
                                <button onClick={() => onDelete(s.id)} style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer'}}>🗑</button>
                            </div>
                        </div>
                        <div style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '15px'}}>{s.contact}</div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '10px', borderTop: '1px solid #f1f5f9'}}>
                            <span style={{color: '#ef4444'}}>{t('sup_total_buy')}: {stats.debt}</span>
                            <span style={{fontWeight: 'bold', color: stats.bal > 0 ? '#ef4444' : '#10b981'}}>{t('sup_current_bal')}: {stats.bal}</span>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* DETAILS MODAL */}
        {selectedSupplier && (
            <div style={styles.modalOverlay} onClick={() => setSelectedSupplierId(null)}>
                <div style={{...styles.modalContent, maxWidth:'800px'}} onClick={e => e.stopPropagation()}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                        <h2 style={{margin:0}}>{selectedSupplier.name}</h2>
                        <button onClick={() => setSelectedSupplierId(null)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>✕</button>
                    </div>

                    {/* Financial Summary Strip */}
                    <div style={{display:'flex', gap:'10px', marginBottom:'20px', overflowX:'auto'}}>
                        <div style={{flex:1, background:'#fef2f2', padding:'15px', borderRadius:'12px', textAlign:'center', border:'1px solid #fee2e2'}}>
                            <div style={{fontSize:'0.8rem', color:'#991b1b', marginBottom:'5px'}}>{t('sup_total_buy')}</div>
                            <div style={{fontSize:'1.2rem', fontWeight:'bold', color:'#ef4444'}}>{historyData.totalDebit}</div>
                        </div>
                        <div style={{flex:1, background:'#f0fdf4', padding:'15px', borderRadius:'12px', textAlign:'center', border:'1px solid #dcfce7'}}>
                            <div style={{fontSize:'0.8rem', color:'#166534', marginBottom:'5px'}}>{t('sup_total_pay')}</div>
                            <div style={{fontSize:'1.2rem', fontWeight:'bold', color:'#10b981'}}>{historyData.totalCredit}</div>
                        </div>
                        <div style={{flex:1, background:'#f8fafc', padding:'15px', borderRadius:'12px', textAlign:'center', border:'1px solid #e2e8f0'}}>
                            <div style={{fontSize:'0.8rem', color:'#334155', marginBottom:'5px'}}>{t('sup_current_bal')}</div>
                            <div style={{fontSize:'1.2rem', fontWeight:'bold', color: historyData.balance > 0 ? '#ef4444' : '#10b981'}}>{historyData.balance}</div>
                        </div>
                    </div>

                    <div style={{backgroundColor:'#f8fafc', padding:'15px', borderRadius:'12px', marginBottom:'20px'}}>
                        <h4 style={{marginTop:0, marginBottom:'10px'}}>{t('sup_add_payment')}</h4>
                        <div style={{display:'flex', gap:'10px'}}>
                             <input className="form-input" type="number" placeholder={t('fin_amount')} value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} style={{flex:1}} />
                             <input className="form-input" placeholder={t('th_notes')} value={payForm.notes} onChange={e => setPayForm({...payForm, notes: e.target.value})} style={{flex:2}} />
                             <button style={styles.button} onClick={handleAddPayment}>{t('btn_save')}</button>
                        </div>
                    </div>

                    <div style={{maxHeight:'400px', overflowY:'auto'}}>
                         <table className="modern-table">
                             <thead>
                                 <tr>
                                     <th>{t('th_date')}</th>
                                     <th>{t('th_desc')}</th>
                                     <th style={{color:'#ef4444'}}>{t('th_debit')}</th>
                                     <th style={{color:'#10b981'}}>{t('th_credit')}</th>
                                     <th>{t('th_balance')}</th>
                                     <th>{t('th_notes')}</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {historyData.list.map((item: any) => (
                                     <tr key={`${item.type}-${item.id}`} style={{backgroundColor: item.type === 'payment' ? '#f0fdf4' : 'white'}}>
                                         <td style={{fontSize:'0.85rem'}}>{formatDate(item.date)}</td>
                                         <td style={{fontSize:'0.9rem'}}>{item.type === 'order' ? `${item.device} - ${item.issue}` : t('sup_add_payment')}</td>
                                         <td style={{color: '#ef4444', fontWeight: item.debit > 0 ? 'bold' : 'normal'}}>{item.debit > 0 ? item.debit : '-'}</td>
                                         <td style={{color: '#10b981', fontWeight: item.credit > 0 ? 'bold' : 'normal'}}>{item.credit > 0 ? item.credit : '-'}</td>
                                         <td style={{fontWeight:'bold', color:'#334155'}}>{item.balance}</td>
                                         <td>
                                             {item.type === 'payment' ? (
                                                 editingPaymentId === item.id ? (
                                                     <div style={{display:'flex', gap:'5px'}}>
                                                         <input className="form-input" style={{padding:'4px', fontSize:'0.8rem'}} value={editNotes} onChange={e => setEditNotes(e.target.value)} autoFocus />
                                                         <button style={{...styles.button, padding:'2px 6px', fontSize:'0.7rem'}} onClick={() => handleSaveEdit(item)}>✓</button>
                                                         <button style={{...styles.secondaryButton, padding:'2px 6px', fontSize:'0.7rem'}} onClick={() => setEditingPaymentId(null)}>✕</button>
                                                     </div>
                                                 ) : (
                                                     <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                                         <span>{item.notes || '-'}</span>
                                                         <button onClick={() => { setEditingPaymentId(item.id); setEditNotes(item.notes || ''); }} style={{background:'none', border:'none', cursor:'pointer', opacity:0.5, fontSize:'0.8rem'}}>✏️</button>
                                                     </div>
                                                 )
                                             ) : <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>{item.notes || '-'}</span>}
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const FinanceTab = ({ orders, transactions, onAddTransaction, onToggleTransaction, t, styles }: any) => {
  const [expForm, setExpForm] = useState({ amount: '', desc: '' });
  
  const rev = orders.filter((o:Order) => o.status === 'تم التسليم').reduce((s:number, o:Order) => s + o.price, 0);
  const cogs = orders.filter((o:Order) => o.status === 'تم التسليم').reduce((s:number, o:Order) => s + o.cost, 0);
  const loss = orders.filter((o:Order) => o.status === 'مرتجع').reduce((s:number, o:Order) => s + o.cost, 0);
  const exp = transactions.filter((tr:Transaction) => tr.type === 'مصروف_مشترك' && !tr.isCancelled).reduce((s:number, tr:Transaction) => s + tr.amount, 0);
  const net = rev - cogs - loss - exp;

  const expensesList = transactions
    .filter((tr: Transaction) => tr.type === 'مصروف_مشترك')
    .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="animate-in">
       <div style={{...styles.grid, marginBottom: '30px'}}>
           <div style={styles.statCard('#3b82f6')}>
               <span style={{color: '#64748b'}}>{t('fin_revenue')}</span>
               <span style={{fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6'}}>{rev}</span>
           </div>
           <div style={styles.statCard('#f59e0b')}>
               <span style={{color: '#64748b'}}>{t('fin_cost_sold')}</span>
               <span style={{fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b'}}>{cogs}</span>
           </div>
           <div style={styles.statCard('#ef4444')}>
               <span style={{color: '#64748b'}}>{t('fin_losses')}</span>
               <span style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444'}}>{loss}</span>
           </div>
           <div style={{...styles.statCard('#10b981'), background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none'}}>
               <span style={{color: 'rgba(255,255,255,0.9)'}}>{t('fin_net_dist')}</span>
               <span style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white'}}>{net}</span>
           </div>
       </div>

       <div style={{...styles.card, marginBottom: '25px'}}>
           <h4 style={{marginTop: 0}}>{t('fin_add_exp')}</h4>
           <div style={{display: 'flex', gap: '15px'}}>
               <input className="form-input" type="number" placeholder={t('fin_amount')} value={expForm.amount} onChange={e => setExpForm({...expForm, amount: e.target.value})} style={{flex: 1}} />
               <input className="form-input" placeholder={t('fin_desc')} value={expForm.desc} onChange={e => setExpForm({...expForm, desc: e.target.value})} style={{flex: 2}} />
               <button style={styles.button} onClick={() => { if(expForm.amount) { onAddTransaction({date: new Date().toISOString(), type: 'مصروف_مشترك', amount: Number(expForm.amount), description: expForm.desc}); setExpForm({amount:'', desc:''}); } }}>{t('fin_record')}</button>
           </div>
       </div>

       {/* List of Shared Expenses */}
       <div style={{...styles.card, padding: 0, overflow: 'hidden'}}>
            <div style={{padding:'15px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', fontWeight:'bold', color: '#64748b'}}>
                {t('fin_shared_exp')}
            </div>
            <div style={{maxHeight:'300px', overflowY:'auto'}}>
                <table className="modern-table">
                    <tbody>
                        {expensesList.length === 0 ? (
                            <tr><td colSpan={4} style={{textAlign: 'center', color: '#94a3b8'}}>{t('no_data')}</td></tr>
                        ) : (
                            expensesList.map((tr:Transaction) => (
                                <tr key={tr.id} style={{opacity: tr.isCancelled ? 0.5 : 1, background: tr.isCancelled ? '#f1f5f9' : 'white'}}>
                                    <td>{formatDate(tr.date)}</td>
                                    <td>{tr.description}</td>
                                    <td style={{color:'#ef4444', fontWeight:'bold'}}>{tr.amount}</td>
                                    <td style={{textAlign:'center'}}>
                                        <button style={{...styles.dangerButton, padding:'4px 8px', fontSize:'0.7rem'}} onClick={()=>onToggleTransaction(tr.id)}>
                                            {tr.isCancelled ? t('btn_undo') : t('btn_cancel')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};

// --- New Components ---

const WithdrawalsTab = ({ orders, transactions, onAddTransaction, onToggleTransaction, t, styles }: any) => {
  const [form, setForm] = useState({ amount: '', desc: '', type: 'سحب_فني' });

  // Calculations
  const rev = orders.filter((o:Order) => o.status === 'تم التسليم').reduce((s:number, o:Order) => s + o.price, 0);
  const cogs = orders.filter((o:Order) => o.status === 'تم التسليم').reduce((s:number, o:Order) => s + o.cost, 0);
  const loss = orders.filter((o:Order) => o.status === 'مرتجع').reduce((s:number, o:Order) => s + o.cost, 0);
  const exp = transactions.filter((tr:Transaction) => tr.type === 'مصروف_مشترك' && !tr.isCancelled).reduce((s:number, tr:Transaction) => s + tr.amount, 0);
  const net = rev - cogs - loss - exp;
  const share = net / 2;

  const techDraw = transactions.filter((tr:Transaction) => tr.type === 'سحب_فني' && !tr.isCancelled).reduce((s:number, tr:Transaction) => s + tr.amount, 0);
  const manDraw = transactions.filter((tr:Transaction) => tr.type === 'سحب_مدير' && !tr.isCancelled).reduce((s:number, tr:Transaction) => s + tr.amount, 0);

  const getWithdrawals = (type: string) => transactions.filter((tr:Transaction) => tr.type === type).sort((a:Transaction, b:Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="animate-in">
        <div style={{...styles.grid, marginBottom: '30px'}}>
            <div style={styles.statCard(share - techDraw >= 0 ? '#10b981' : '#ef4444')}>
                <h4 style={{margin:0, color:'#64748b'}}>{t('wd_tech')}</h4>
                <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#334155'}}>{(share - techDraw).toFixed(2)}</div>
                <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>{t('wd_share')}: {share.toFixed(2)} | {t('wd_drawn')}: {techDraw}</div>
            </div>
            <div style={styles.statCard(share - manDraw >= 0 ? '#10b981' : '#ef4444')}>
                <h4 style={{margin:0, color:'#64748b'}}>{t('wd_manager')}</h4>
                <div style={{fontSize:'1.5rem', fontWeight:'bold', color:'#334155'}}>{(share - manDraw).toFixed(2)}</div>
                <div style={{fontSize:'0.8rem', color:'#94a3b8'}}>{t('wd_share')}: {share.toFixed(2)} | {t('wd_drawn')}: {manDraw}</div>
            </div>
        </div>

        <div style={{...styles.card, marginBottom: '30px'}}>
            <h4 style={{marginTop:0}}>{t('wd_new')}</h4>
            <div style={{display:'flex', gap:'15px', flexWrap:'wrap'}}>
                <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{flex:1}}>
                    <option value="سحب_فني">{t('wd_tech_opt')}</option>
                    <option value="سحب_مدير">{t('wd_manager_opt')}</option>
                </select>
                <input className="form-input" type="number" placeholder={t('fin_amount')} value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={{flex:1}} />
                <input className="form-input" placeholder={t('th_notes')} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} style={{flex:2}} />
                <button style={styles.button} onClick={() => { if(form.amount) { onAddTransaction({date: new Date().toISOString(), type: form.type, amount: Number(form.amount), description: form.desc}); setForm({...form, amount:'', desc:''}); } }}>{t('btn_add')}</button>
            </div>
        </div>

        <div style={styles.grid}>
             {[ 'سحب_فني', 'سحب_مدير' ].map(type => (
                 <div key={type} style={{...styles.card, padding:0, overflow:'hidden'}}>
                     <div style={{padding:'15px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0', fontWeight:'bold'}}>
                         {type === 'سحب_فني' ? t('wd_tech') : t('wd_manager')}
                     </div>
                     <div style={{maxHeight:'300px', overflowY:'auto'}}>
                         <table className="modern-table">
                             <tbody>
                                 {getWithdrawals(type).map((tr:Transaction) => (
                                     <tr key={tr.id} style={{opacity: tr.isCancelled ? 0.5 : 1}}>
                                         <td>{formatDate(tr.date)}</td>
                                         <td>{tr.description}</td>
                                         <td style={{color:'#ef4444', fontWeight:'bold'}}>{tr.amount}</td>
                                         <td style={{textAlign:'center'}}>
                                             <button style={{...styles.dangerButton, padding:'4px 8px', fontSize:'0.7rem'}} onClick={()=>onToggleTransaction(tr.id)}>
                                                 {tr.isCancelled ? t('btn_undo') : t('btn_cancel')}
                                             </button>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
             ))}
        </div>
    </div>
  );
};

const HistoryTab = ({ orders, t, styles }: any) => {
    const [search, setSearch] = useState('');
    const filtered = orders.filter((o:Order) => o.customerName.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search) || o.device.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="animate-in">
            <div style={{...styles.card, marginBottom:'20px'}}>
                <input className="form-input" placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{...styles.card, padding:0, overflow:'hidden'}}>
                <div style={{overflowX:'auto'}}>
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>{t('th_date')}</th>
                                <th>{t('th_customer')}</th>
                                <th>{t('th_device')}</th>
                                <th>{t('th_status')}</th>
                                <th>{t('th_notes')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o:Order) => (
                                <tr key={o.id}>
                                    <td>{formatDate(o.date)}</td>
                                    <td>{o.customerName}</td>
                                    <td>{o.device}</td>
                                    <td>{o.status}</td>
                                    <td style={{maxWidth:'300px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{o.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- New Request Form ---

const NewRequestForm = ({ onAdd, suppliers, t, styles }: any) => {
  const [form, setForm] = useState<any>({ customerName: '', phone: '', device: '', issue: '', cost: '', price: '' });
  return (
    <div style={{...styles.card, maxWidth: '800px', margin: '0 auto'}} className="animate-in">
        <h3 style={{marginTop: 0, marginBottom: '25px', color: '#1e293b'}}>{t('req_title')}</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
            <div><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('th_customer')}</label><input className="form-input" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} /></div>
            <div><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('th_phone')}</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('th_device')}</label><input className="form-input" value={form.device} onChange={e => setForm({...form, device: e.target.value})} /></div>
            <div><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('th_issue')}</label><input className="form-input" value={form.issue} onChange={e => setForm({...form, issue: e.target.value})} /></div>
            <div><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('req_expected_cost')}</label><input className="form-input" type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} /></div>
            <div><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('req_price_client')}</label><input className="form-input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
            <div style={{gridColumn: '1 / -1'}}><label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>{t('th_supplier')}</label><select className="form-input" onChange={e => setForm({...form, supplierId: Number(e.target.value)})}>
                <option value="">{t('req_supplier_opt')}</option>
                {suppliers.map((s:Supplier) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select></div>
        </div>
        <button style={{...styles.button, width: '100%', justifyContent: 'center', padding: '15px'}} onClick={() => { if(form.customerName) { onAdd({...form, id: 0, date: new Date().toISOString(), status: 'قيد التشخيص', cost: Number(form.cost), price: Number(form.price), notes: ''}); setForm({customerName:'', phone:'', device:'', issue:'', cost:'', price:''}); } }}>{t('req_save')}</button>
    </div>
  );
};

// --- Login Component ---

const LoginScreen = ({ onLogin, t, styles }: { onLogin: () => void, t: any, styles: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lang, setLang] = useState<Language>('ar');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim spaces and normalize username case check
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'lazzar' && cleanPass === 'Lazzar@88') {
      onLogin();
    } else {
      setError(t('login_error'));
    }
  };

  return (
    <div style={{
      ...styles.modalOverlay,
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <GlobalStyles />
      <div style={{...styles.card, width: '100%', maxWidth: '400px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
          <h1 style={{fontSize: '2rem', marginBottom: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800'}}>🛠 {t('app_title')}</h1>
          <p style={{color: '#64748b', fontSize: '1.1rem'}}>{t('login_title')}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>{t('login_user')}</label>
            <input 
              className="form-input" 
              value={username} 
              onChange={e => {setUsername(e.target.value); setError('');}}
              placeholder="Lazzar"
              autoFocus 
            />
          </div>
          <div style={{marginBottom: '25px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>{t('login_pass')}</label>
            <input 
              type="password"
              className="form-input" 
              value={password} 
              placeholder="••••••••"
              onChange={e => {setPassword(e.target.value); setError('');}} 
            />
          </div>
          
          {error && <div style={{color: '#ef4444', marginBottom: '20px', textAlign: 'center', fontWeight: '600', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '8px'}}>{error}</div>}
          
          <button style={{...styles.button, width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem', marginBottom: '20px'}} type="submit">
            {t('login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lang, setLang] = useState<Language>('ar');
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'|'info'|'warning'} | null>(null);

  const t = (key: string) => (TRANSLATIONS[lang] as any)[key] || key;
  const styles = getStyles(lang === 'ar' ? 'rtl' : 'ltr');

  // Check login status on mount
  useEffect(() => {
    const auth = localStorage.getItem('rcm_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Load initial data (Simulated)
  useEffect(() => {
      const savedOrders = localStorage.getItem('rcm_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSuppliers = localStorage.getItem('rcm_suppliers');
      if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));

      const savedPayments = localStorage.getItem('rcm_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      
      const savedTransactions = localStorage.getItem('rcm_transactions');
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

      const savedNotifications = localStorage.getItem('rcm_notifications');
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Save data on change
  useEffect(() => { localStorage.setItem('rcm_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('rcm_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('rcm_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('rcm_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('rcm_notifications', JSON.stringify(notifications)); }, [notifications]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('rcm_auth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('rcm_auth');
    setActiveTab('dashboard');
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' | 'warning') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
      setNotifications(prev => [{
          id: Date.now(),
          message,
          timestamp: new Date().toISOString(),
          isRead: false,
          type
      }, ...prev].slice(0, 50)); // Keep last 50
  };

  const handleAddOrder = (order: Order) => {
      const newOrder = { ...order, id: Date.now() };
      setOrders([newOrder, ...orders]);
      showToast(t('req_save'), 'success');
      addNotification(`${t('req_title')}: ${newOrder.device} - ${newOrder.customerName}`, 'success');
      setActiveTab('followup');
  };

  const handleUpdateStatus = (id: number, status: Status, cost: number = 0) => {
      const order = orders.find(o => o.id === id);
      setOrders(orders.map(o => o.id === id ? { ...o, status, cost: cost || o.cost } : o));
      if (order && order.status !== status) {
         addNotification(`${t('th_status')}: ${order.device} -> ${status}`, status === 'مرتجع' ? 'warning' : 'info');
      }
  };

  const handleCloneOrder = (order: Order) => {
      const newOrder = { ...order, id: Date.now(), date: new Date().toISOString(), status: 'قيد التشخيص' as Status, notes: order.notes + ' (Clone)' };
      setOrders([newOrder, ...orders]);
      showToast(t('req_save'), 'success');
      addNotification(`${t('btn_clone')}: ${order.device}`, 'info');
  };

  const handleDeleteOrder = (id: number) => {
      const order = orders.find(o => o.id === id);
      setOrders(orders.filter(o => o.id !== id));
      if (order) addNotification(`${t('btn_delete')}: ${order.device}`, 'warning');
  };

  const handleUpdateOrder = (order: Order) => {
      setOrders(orders.map(o => o.id === order.id ? order : o));
  };

  const handleAddSupplier = (supplier: Supplier) => {
      setSuppliers([...suppliers, { ...supplier, id: Date.now() }]);
  };

  const handleDeleteSupplier = (id: number) => {
      setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const handleAddPayment = (payment: SupplierPayment) => {
      setPayments([...payments, { ...payment, id: Date.now() }]);
  };

  const handleUpdatePayment = (payment: SupplierPayment) => {
      setPayments(payments.map(p => p.id === payment.id ? payment : p));
  };

  const handleAddTransaction = (transaction: Transaction) => {
      setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  const handleToggleTransaction = (id: number) => {
      setTransactions(transactions.map(t => t.id === id ? { ...t, isCancelled: !t.isCancelled } : t));
  };

  const handleExport = () => {
      const data = JSON.stringify({ orders, suppliers, payments, transactions });
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
  };

  const handleImport = (data: any) => {
      if (data.orders) setOrders(data.orders);
      if (data.suppliers) setSuppliers(data.suppliers);
      if (data.payments) setPayments(data.payments);
      if (data.transactions) setTransactions(data.transactions);
      showToast(t('note_import_success'), 'success');
      addNotification(t('note_import_success'), 'success');
  };

  const activeOrders = orders.filter(o => o.status !== 'تم التسليم' && o.status !== 'مرتجع');
  const readyForPickup = orders.filter(o => o.status === 'جاهز للتسليم');
  const delayedDiagnosis = activeOrders.filter(o => o.status === 'قيد التشخيص' && getDaysDifference(o.date) > 2);
  const waitingParts = activeOrders.filter(o => o.status === 'في انتظار القطعة');

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} t={t} styles={styles} />;
  }

  return (
    <div style={styles.container}>
      <GlobalStyles />
      <div style={styles.header}>
        <h1 style={styles.logoTitle}>🛠 {t('app_title')}</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={styles.secondaryButton}>🌐 {t('dash_switch_lang')}</button>
          <button onClick={handleLogout} style={{...styles.secondaryButton, color: '#ef4444', borderColor: '#fee2e2'}}>🚪 {t('logout_btn')}</button>
        </div>
      </div>

      <div style={styles.tabs}>
        {[
          { id: 'dashboard', icon: '📊', label: 'tab_dashboard' },
          { id: 'new_request', icon: '📝', label: 'tab_new_request' },
          { id: 'followup', icon: '🔍', label: 'tab_followup' },
          { id: 'suppliers', icon: '🚛', label: 'tab_suppliers' },
          { id: 'finance', icon: '💰', label: 'tab_finance' },
          { id: 'withdrawals', icon: '💸', label: 'tab_withdrawals' },
          { id: 'history', icon: '📜', label: 'tab_history' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={styles.tabButton(activeTab === tab.id)}>
            {tab.icon} {t(tab.label)}
            {tab.id === 'followup' && activeOrders.length > 0 && <span style={styles.notificationBadge}>{activeOrders.length}</span>}
            {tab.id === 'dashboard' && notifications.length > 0 && <span style={styles.notificationBadge}>{notifications.length}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <DashboardTab {...{ orders, activeOrders, readyForPickup, delayedDiagnosis, waitingParts, notifications, onClearNotifications: () => setNotifications([]), onExport: handleExport, onImport: handleImport, onShowToast: showToast, t, styles }} />}
      {activeTab === 'new_request' && <NewRequestForm {...{ onAdd: handleAddOrder, suppliers, t, styles }} />}
      {activeTab === 'followup' && <FollowUpList {...{ orders: orders, onUpdateStatus: handleUpdateStatus, onClone: handleCloneOrder, onDelete: handleDeleteOrder, onUpdateOrder: handleUpdateOrder, suppliers, onShowToast: showToast, t, styles }} />}
      {activeTab === 'suppliers' && <SuppliersTab {...{ suppliers, orders, payments, onAdd: handleAddSupplier, onDelete: handleDeleteSupplier, onAddPayment: handleAddPayment, onUpdatePayment: handleUpdatePayment, t, styles }} />}
      {activeTab === 'finance' && <FinanceTab {...{ orders, transactions, onAddTransaction: handleAddTransaction, onToggleTransaction: handleToggleTransaction, t, styles }} />}
      {activeTab === 'withdrawals' && <WithdrawalsTab {...{ orders, transactions, onAddTransaction: handleAddTransaction, onToggleTransaction: handleToggleTransaction, t, styles }} />}
      {activeTab === 'history' && <HistoryTab {...{ orders, t, styles }} />}

      {toast && <div style={styles.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
};

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}