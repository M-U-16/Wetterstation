import base64
from datetime import datetime
import html
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.pagesizes import A4, LETTER, A5
from reportlab.lib.colors import blue, HexColor
from reportlab.lib.colors import lightblue
from reportlab.graphics.charts import linecharts
from jinja2 import Environment, PackageLoader, select_autoescape
from reportlab.graphics.renderSVG import draw

from weasyprint import HTML, Document

def to_base64(path):
    with open(path, "rb") as img_file:
        return ("data:image/png;base64, " +
            str(base64.b64encode(img_file.read()), encoding="utf8")
        )

env = Environment(
    loader=PackageLoader("test", package_path="templates"),
    autoescape=select_autoescape()
)
env.filters["to_base64"] = to_base64
""" 
with open("test.html", "w") as html_file:
    html_file.write(env.get_template("report.html").render(pdf=True))
 """
 
HTML(string=env.get_template("report.html").render(pdf=True)
).write_pdf("test.pdf")
    #pisa_status = pisa.CreatePDF(
        #env.get_template("report.html").render(pdf=True),
    #    pdf_file

exit(0)

CURRENT_FORMAT = A4

pdf = Canvas("report.pdf", pagesize=CURRENT_FORMAT)
pdf.setTitle("WetterReport-30_01_2025")
pdf.setFont("Helvetica-Bold", 36)
pdf.setFillColor(HexColor(0x0080ff))

pdf.drawString(
    CURRENT_FORMAT[0]/2-(pdf.stringWidth("Wetter-Report", "Helvetica", 36)/2),
    CURRENT_FORMAT[1]-50,
    "Wetter-Report"
)

pdf.drawImage("small-logo.png",
    0, 0,
    width=150,
    height=64,
    preserveAspectRatio=True
    #0, 0,
)

pdf.save()

class Report:
    def __init__(self, date:datetime):
        self.date = date
        self.title = "WetterReport-" + self.date.strftime("%d_%m_%Y")
        self._filename = self.title + ".pdf"
        print(self._filename)
        
Report(datetime(2025, 1, 30))