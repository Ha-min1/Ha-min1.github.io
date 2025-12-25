#include <bits/stdc++.h>
#include <filesystem>
using namespace std;

string timestamp() {
    time_t t = time(nullptr);
    struct tm tm = *localtime(&t);
    char buf[32];
    strftime(buf, sizeof(buf), "%Y%m%d%H%M%S", &tm);
    return string(buf);
}

int main(int argc, char** argv) {
    if (argc != 3) {
        cerr << "Usage: adj <Site Name> <URL>\n";
        return 1;
    }
    string site = argv[1];
    string url = argv[2];

    const string path = "server/public/index.html";
    if (!filesystem::exists(path)) {
        cerr << "Error: cannot find " << path << "\n";
        return 2;
    }

    // Read file
    ifstream in(path);
    string content((istreambuf_iterator<char>(in)), istreambuf_iterator<char>());
    in.close();

    // Backup
    string bak = path + ".bak." + timestamp();
    filesystem::copy_file(path, bak);

    // Find <div class="app-grid">
    size_t start = content.find("<div class=\"app-grid\">");
    if (start == string::npos) {
        cerr << "Error: <div class=\"app-grid\"> not found\n";
        return 3;
    }

    // Find the matching closing </div> for that opening using a simple stack counter
    size_t pos = start;
    int depth = 0;
    // find the first '<div' starting at start
    size_t next_open = content.find("<div", pos);
    size_t next_close = content.find("</div>", pos);
    if (next_open == string::npos) next_open = string::npos;
    if (next_close == string::npos) {
        cerr << "Error: no closing </div> found" << endl;
        return 4;
    }

    // initialize depth by scanning tags starting from the opening <div class="app-grid"> tag
    // set depth to 1 because we start INSIDE that opening div
    size_t scanPos = start + 1;
    depth = 1;
    while (true) {
        size_t openPos = content.find("<div", scanPos);
        size_t closePos = content.find("</div>", scanPos);
        if (closePos == string::npos) {
            cerr << "Error: mismatched divs" << endl;
            return 5;
        }
        if (openPos != string::npos && openPos < closePos) {
            // another opening div before the next close
            depth++;
            scanPos = openPos + 4;
        } else {
            // consume a closing div
            depth--;
            if (depth == 0) {
                // This closing div matches the initial opening
                size_t insertPos = closePos; // insert before this

                // Construct the entry HTML
                string entry = "\n            <a href=\"" + url + "\" class=\"app-button\" target=\"_blank\" rel=\"noopener noreferrer\">\n                <div class=\"app-icon\" aria-hidden=\"true\">🔗</div>\n                <div class=\"app-name\">" + site + "</div>\n            </a>\n        ";

                content.insert(insertPos, entry);

                // Write back
                ofstream out(path);
                out << content;
                out.close();

                cout << "Inserted site '" << site << "' -> " << url << " into " << path << " (backup: " << bak << ")\n";
                return 0;
            } else {
                scanPos = closePos + 6;
            }
        }
    }

    return 6;
}
